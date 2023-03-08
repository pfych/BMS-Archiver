import * as cliProgress from 'cli-progress';
import { createHash } from 'crypto';
import { existsSync, readdir, readFile, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { BMS_PATH, outputFolder } from '../config';
import { BMSDataContainer } from '../types';

export const buildJson = async (): Promise<BMSDataContainer> => {
  console.log('Checking existing BMS database...');

  const progress = new cliProgress.SingleBar(
    {},
    {
      ...cliProgress.Presets.shades_classic,
      format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    },
  );

  progress.start(1, 0);

  let existingBMS: BMSDataContainer = [];
  if (existsSync(path.join(outputFolder, 'bms-data.json'))) {
    existingBMS = JSON.parse(
      readFileSync(path.join(outputFolder, 'bms-data.json')).toString(),
    ) as BMSDataContainer;
  } else {
    writeFileSync(path.join(outputFolder, 'bms-data.json'), '{}');
  }

  const allBMSFolders: string[] = await new Promise((resolve, reject) =>
    readdir(BMS_PATH, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    }),
  );

  const BMSToParse = [
    ...allBMSFolders.filter(
      (parentFolderName) =>
        !existingBMS.find((chart) => chart.folder === parentFolderName),
    ),
  ];

  progress.setTotal(BMSToParse.length);

  for (const folder of BMSToParse) {
    const BMSFiles: string[] = await new Promise((resolve, reject) =>
      readdir(path.join(BMS_PATH, folder), (err, files) => {
        if (err) {
          reject(err);
        } else {
          resolve(
            files.filter((file) =>
              file.match(/.*\.(bms|bml|bmson|bme|bmx|BMS)/g),
            ),
          );
        }
      }),
    );

    await Promise.all(
      BMSFiles.map(
        (BMSFile) =>
          new Promise(async (resolve) => {
            const fullPath = path.join(BMS_PATH, folder, BMSFile);
            const fileBuffer: Buffer = await new Promise((resolve) =>
              readFile(fullPath, (_err, data) => resolve(data)),
            );

            const md5 = createHash('md5').update(fileBuffer).digest('hex');
            const sha256 = createHash('sha256')
              .update(fileBuffer)
              .digest('hex');

            existingBMS.push({
              folder: folder,
              path: fullPath,
              md5: md5,
              sha256: sha256,
            });
            resolve(true);
          }),
      ),
    );

    writeFileSync(
      path.join(outputFolder, 'bms-data.json'),
      JSON.stringify(existingBMS, null, 4),
    );

    progress.increment(1);
  }

  progress.stop();

  return existingBMS;
};
