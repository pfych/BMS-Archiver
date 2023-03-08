export interface BMSData {
  path: string;
  folder: string;
  md5: string;
  sha256: string;
}

export type BMSDataContainer = BMSData[];

export interface TableBMSData {
  tableName: string;
  tableIcon: string;
  localCharts: Record<string, (TableBMSDataItem & { localCopy: BMSData[] })[]>;
  missingCharts: Record<string, TableBMSDataItem[]>;
}

export interface TableBMSDataItem {
  title: string;
  url: string;
  checksums: {
    md5?: string;
    sha256?: string;
  };
}
