import { LoadBMSTable } from 'bms-table-loader';
import * as cliProgress from 'cli-progress';
import { groupBy } from 'lodash';
import { BMSData, TableBMSData, TableBMSDataItem } from '../types';

export const BuildTableJson = async (
  table: string,
  BMSData: BMSData[],
): Promise<TableBMSData> => {
  const tableData = await LoadBMSTable(table);
  console.log(`Generating table data for ${tableData.head.name}`);

  const progress = new cliProgress.SingleBar(
    {},
    {
      ...cliProgress.Presets.shades_classic,
      format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
    },
  );
  progress.start(tableData.body.length, 0);

  const BMSDataGroupedByMD5: Record<string, BMSData[]> = groupBy(
    BMSData,
    'md5',
  );

  const BMSDataGroupedBySha256: Record<string, BMSData[]> = groupBy(
    BMSData,
    'sha256',
  );

  const chartsGroupedByLevel = groupBy(tableData.body, 'content.level');

  let missingCharts: Record<string, TableBMSDataItem[]> = {};
  let localCharts: Record<
    string,
    (TableBMSDataItem & { localCopy: BMSData[] })[]
  > = {};

  Object.keys(chartsGroupedByLevel).forEach((key) => {
    chartsGroupedByLevel[key].map((chart) => {
      const localChart =
        BMSDataGroupedByMD5[chart.checksum.value] ||
        BMSDataGroupedBySha256[chart.checksum.value];

      if (localChart) {
        localCharts[key] = [
          ...(localCharts[key] || []),
          {
            title: chart.content.title as string,
            url:
              (chart.content.url_diff as string) ||
              (chart.content.url as string),
            localCopy: localChart,
            checksums: {
              md5: chart.content.md5 as string,
              sha256: (chart.content.sha256 as string) || '',
            },
          },
        ];
      } else {
        missingCharts[key] = [
          ...(missingCharts[key] || []),
          {
            title: chart.content.title as string,
            url:
              (chart.content.url_diff as string) ||
              (chart.content.url as string),
            checksums: {
              md5: chart.content.md5 as string,
              sha256: (chart.content.sha256 as string) || '',
            },
          },
        ];
      }

      progress.increment(1);
    });
  });

  progress.stop();

  return {
    tableName: tableData.head.name,
    tableIcon: tableData.head.symbol,
    localCharts,
    missingCharts,
  };
};
