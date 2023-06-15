import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TSheetsResponse = {
  sheets: {
    properties: {
      sheetId: string;
      title: string;
    };
  }[];
};

function getColumnNameByNumber(columnNumber: number) {
  let columnName = '';
  while (columnNumber > 0) {
    const modulo = (columnNumber - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    columnNumber = Math.floor((columnNumber - modulo) / 26);
  }
  return columnName;
}

export default {
  name: 'List columns',
  key: 'listColumns',

  async run($: IGlobalVariable) {
    const spreadsheetId = $.step.parameters.spreadsheetId as string;

    const headers: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    if (!spreadsheetId) {
      return headers;
    }

    const {
      data: { sheets },
    } = await $.http.get<TSheetsResponse>(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}`
    );

    const selectedSheet = sheets.find(
      (sheet) => sheet.properties.sheetId === $.step.parameters.worksheetId
    );

    if (!selectedSheet) return;

    const sheetName = selectedSheet.properties.title;

    const range = `${sheetName}!1:1`;

    const { data } = await $.http.get(
      `v4/spreadsheets/${$.step.parameters.spreadsheetId}/values/${range}`
    );

    if (data.values?.length) {
      for (let number = 0; number < data.values[0].length; number++) {
        headers.data.push({
          value: getColumnNameByNumber(number + 1),
          name: data.values[0][number],
        });
      }
    }

    return headers;
  },
};
