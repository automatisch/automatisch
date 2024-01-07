const hasValue = (value) => value !== null && value !== undefined;

export default {
  name: 'List Sheet Headers',
  key: 'listSheetHeaders',

  async run($) {
    if (
      !hasValue($.step.parameters.spreadsheetId) ||
      !hasValue($.step.parameters.worksheetId)
    ) {
      return;
    }

    const {
      data: { sheets },
    } = await $.http.get(`/v4/spreadsheets/${$.step.parameters.spreadsheetId}`);

    const selectedSheet = sheets.find(
      (sheet) => sheet.properties.sheetId === $.step.parameters.worksheetId
    );

    if (!selectedSheet) return;

    const sheetName = selectedSheet.properties.title;

    const range = `${sheetName}!1:1`;

    const params = {
      majorDimension: 'ROWS',
    };

    const { data } = await $.http.get(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}/values/${range}`,
      {
        params,
      }
    );

    if (!data.values) {
      return;
    }

    const result = data.values[0].map((item, index) => ({
      label: item,
      key: `header-${index}`,
      type: 'string',
      required: false,
      value: item,
      variables: true,
    }));

    return result;
  },
};
