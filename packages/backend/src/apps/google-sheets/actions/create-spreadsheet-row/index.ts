import defineAction from '../../../../helpers/define-action';

type TSheetsResponse = {
  sheets: {
    properties: {
      sheetId: string;
      title: string;
    };
  }[];
};

export default defineAction({
  name: 'Create spreadsheet row',
  key: 'createSpreadsheetRow',
  description: 'Creates a new row in a specified spreadsheet.',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown' as const,
      required: false,
      description:
        'The Google Drive where your spreadsheet resides. If nothing is selected, then your personal Google Drive will be used.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDrives',
          },
        ],
      },
    },
    {
      label: 'Spreadsheet',
      key: 'spreadsheetId',
      type: 'dropdown' as const,
      required: true,
      dependsOn: ['parameters.driveId'],
      description: 'The spreadsheets in your Google Drive.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSpreadsheets',
          },
          {
            name: 'parameters.driveId',
            value: '{parameters.driveId}',
          },
        ],
      },
    },
    {
      label: 'Worksheet',
      key: 'worksheetId',
      type: 'dropdown' as const,
      required: true,
      dependsOn: ['parameters.spreadsheetId'],
      description: 'The worksheets in your selected spreadsheet.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWorksheets',
          },
          {
            name: 'parameters.spreadsheetId',
            value: '{parameters.spreadsheetId}',
          },
        ],
      },
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listSheetHeaders',
          },
          {
            name: 'parameters.worksheetId',
            value: '{parameters.worksheetId}',
          },
          {
            name: 'parameters.spreadsheetId',
            value: '{parameters.spreadsheetId}',
          },
        ],
      },
    },
  ],

  async run($) {
    const {
      data: { sheets },
    } = await $.http.get<TSheetsResponse>(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}`
    );

    const selectedSheet = sheets.find(
      (sheet) => sheet.properties.sheetId === $.step.parameters.worksheetId
    );

    const sheetName = selectedSheet.properties.title;

    const range = sheetName;

    const dataValues = Object.entries($.step.parameters)
      .filter((entry: [string, string]) => entry[0].startsWith('header-'))
      .map((value) => value[1]);

    const values = [dataValues];

    const params = {
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      includeValuesInResponse: true,
    };

    const body = {
      majorDimension: 'ROWS',
      range,
      values,
    };

    const { data } = await $.http.post(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}/values/${range}:append`,
      body,
      { params }
    );

    $.setActionItem({
      raw: data,
    });
  },
});
