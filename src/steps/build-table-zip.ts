import archiver from 'archiver';
import * as cliProgress from 'cli-progress';
import { createWriteStream, mkdirSync } from 'fs';
import getFolderSize from 'get-folder-size';
import { sum } from 'lodash';
import path from 'path';
import { BMS_PATH, outputFolder } from '../config';
import { TableBMSData } from '../types';

export const buildTableZip = async (
  tableBMSData: TableBMSData,
): Promise<void> => {
  const levelsWithLocalFiles = Object.keys(tableBMSData.localCharts);

  for (const level of levelsWithLocalFiles) {
    if (!tableBMSData.missingCharts[level]) {
      const progress = new cliProgress.SingleBar(
        {},
        {
          ...cliProgress.Presets.shades_classic,
          format: '[{bar}] {percentage}% | {value}/{total}',
        },
      );

      mkdirSync(path.join(outputFolder, 'zips', tableBMSData.tableName), {
        recursive: true,
      });

      const estimatedByteSize = sum(
        await Promise.all(
          tableBMSData.localCharts[level].map((file) => {
            const folder = file.localCopy[0].folder;
            return getFolderSize.loose(path.join(BMS_PATH, folder));
          }),
        ),
      );

      const outputFile = `${tableBMSData.tableName}-${level}.tar.gz`;
      const archive = archiver('tar', {
        gzip: true,
        gzipOptions: {
          level: 6,
        } /** @TODO Investigate zlib options to increase compression speed (maybe?) */,
      });
      const output = createWriteStream(
        path.join(outputFolder, 'zips', tableBMSData.tableName, outputFile),
      );
      archive.pipe(output);

      // Handle archive or stream errors & events
      output.on('error', (error) => console.error(error));
      archive.on('warning', (warning) => console.warn(warning));

      // Handle archive or stream events to drive progress bars
      output.on('open', () => {
        /** @TODO sometimes this prints before the last progress bar has finished... */
        console.log(`Compressing ${tableBMSData.tableIcon}${level}...`);
        progress.start(Math.ceil(estimatedByteSize / Math.pow(1024, 2)), 0);
      });
      archive.on('progress', (data) => {
        progress.update(Math.ceil(data.fs.totalBytes / Math.pow(1024, 2)));
      });
      output.on('close', () => {
        progress.update(Math.ceil(estimatedByteSize / Math.pow(1024, 2)));
        progress.stop();
      });

      tableBMSData.localCharts[level].forEach((file) => {
        const chartFolder = file.localCopy[0].folder;
        archive.directory(path.join(BMS_PATH, chartFolder), chartFolder, {
          prefix: `${tableBMSData.tableName}-${level}`,
        });
      });

      await archive.finalize();
    }
  }
};
