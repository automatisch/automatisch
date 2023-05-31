import { IGlobalVariable } from '@automatisch/types';

type TSheetsResponse = {
  sheets: {
    properties: {
      sheetId: string;
      title: string;
    };
  }[];
};

type TSheetsValueResponse = {
  majorDimension: string;
  range: string;
  values: string[][];
};

const hasValue = (value: any) => value !== null && value !== undefined;

export default {
  name: 'List Sheet Headers',
  key: 'listSheetHeaders',

  async run($: IGlobalVariable) {
    if (!hasValue($.step.parameters.spreadsheetId) || !hasValue($.step.parameters.worksheetId)) {
      return;
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

    const params: Record<string, unknown> = {
      majorDimension: 'ROWS',
    };

    const { data } = await $.http.get<TSheetsValueResponse>(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}/values/${range}`,
      {
        params,
      }
    );

    if (!data.values) {
      return;
    }

    const result = data.values[0].map((item: string, index: number) => ({
      label: item,
      key: `header-${index}`,
      type: 'string' as const,
      required: false,
      value: item,
      variables: true,
    }));

    return result;
  },
};
