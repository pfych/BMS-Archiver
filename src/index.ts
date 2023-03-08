import { writeFileSync } from 'fs';
import path from 'path';
import { outputFolder, tables } from './config';
import { buildJson } from './steps/build-json';
import { BuildTableJson } from './steps/build-table-json';
import { buildTableZip } from './steps/build-table-zip';

void (async () => {
  const baseBMSData = await buildJson();

  /** @deprecated Take advantage of potentially existing JSON & avoid re-creating archives */
  let localTableData = [];
  for (const table of tables) {
    let data = await BuildTableJson(table, baseBMSData);

    /** @TODO eventually skip refreshing tables & archives if existing json is the same (Meaning nothing changed) */
    writeFileSync(
      path.join(outputFolder, 'tables', `${data.tableName}-table.json`),
      JSON.stringify(data, null, 4),
    );

    localTableData.push(data);
  }

  for (const table of localTableData) {
    await buildTableZip(table);
  }
})();
