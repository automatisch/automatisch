import { IGlobalVariable } from '@automatisch/types';

type TSheetsResponse = {
  sheets: {
    properties: {
      sheetId: string;
      title: string;
    };
  }[];
};

const newSpreadsheetRows = async ($: IGlobalVariable) => {
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

  const range = sheetName;

  const { data } = await $.http.get(
    `v4/spreadsheets/${$.step.parameters.spreadsheetId}/values/${range}`
  );

  if (data.values?.length) {
    for (let index = data.values.length - 1; index > 0; index--) {
      const value = data.values[index];
      $.pushTriggerItem({
        raw: { row: value },
        meta: {
          internalId: index.toString(),
        },
      });
    }
  }
};

export default newSpreadsheetRows;
