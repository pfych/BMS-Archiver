import path from 'path';

/** @description Absolute path to BMS folder*/
export const BMS_PATH = path.join('/', 'mnt', 'RSL', 'BMS');

/** @description Aboslute path to output folder for caches & archives */
export const outputFolder = path.join(__dirname, '..', 'data');

/** @description array of BMS table URLs
 *  @example [ 'https://stellabms.xyz/sl/table.html' ] */
export const tables = [
  'http://bmsnormal2.syuriken.jp/table.html',
  'https://stellabms.xyz/sl/table.html',
];
