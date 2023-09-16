const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./.credentials/loungeservice-fede8dedf5cd.json'); // Docs: Google sheet json file
const i18nextConfig = require('../../i18next-scanner.config');

const spreadsheetDocId = '1FIH2_Qlt0laaO6I1N5GeUyEynP6xEVMKAI880jd8u94';
const ns = 'translation';
const lngs = i18nextConfig.options.lngs;

const sheetId = 0; //gid from Google Spread Sheet - can find it from url
const loadPath = i18nextConfig.options.resource.loadPath;
const localesPath = loadPath.replace('/{{lng}}/{{ns}}.json', '');
const rePluralPostfix = new RegExp(/_plural|_[\d]/g);

const NOT_AVAILABLE_CELL = 'N/A'; // Translation not needed part (번역이 필요없는 부분)

const columnKeyToHeader = {
  // Header for Spread Sheet
  key: '키',
  ko: '한글',
  en: '영어',
  // ja: '일본어',
};

async function loadSpreadsheet() {
  // eslint-disable-next-line no-console
  console.info(
    '\u001B[32m',
    '=====================================================================================================================\n',
    '# i18next auto-sync using Spreadsheet\n\n',
    '  * Download translation resources from Spreadsheet and make /src/locales//.json\n',
    '  * Upload translation resources to Spreadsheet.\n\n',
    `The Spreadsheet for translation is here (\u001B[34mhttps://docs.google.com/spreadsheets/d/${spreadsheetDocId}/#gid=${sheetId}\u001B[0m)\n`,
    '=====================================================================================================================',
    '\u001B[0m'
  );

  // spreadsheet key is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(spreadsheetDocId);

  // load directly from json file if not in secure environment
  await doc.useServiceAccountAuth(creds);

  await doc.loadInfo(); // loads document properties and worksheets

  return doc;
}

function getPureKey(key = '') {
  return key.replace(rePluralPostfix, '');
}

module.exports = {
  localesPath,
  loadSpreadsheet,
  getPureKey,
  ns,
  lngs,
  sheetId,
  columnKeyToHeader,
  NOT_AVAILABLE_CELL,
};
