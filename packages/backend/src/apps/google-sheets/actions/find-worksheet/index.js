import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Find worksheet',
  key: 'findWorksheet',
  description:
    'Finds a worksheet by title. Optionally, create a worksheet if none are found.',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown',
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
      type: 'dropdown',
      required: true,
      dependsOn: ['parameters.driveId'],
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
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description:
        'The worksheet title needs to match exactly, and the search is case-sensitive.',
      variables: true,
    },
    {
      label: 'Create worksheet if none are found.',
      key: 'createWorksheet',
      type: 'dropdown',
      required: false,
      options: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listCreateWorksheetFields',
          },
          {
            name: 'parameters.createWorksheet',
            value: '{parameters.createWorksheet}',
          },
        ],
      },
    },
  ],

  async run($) {
    const createWorksheet = $.step.parameters.createWorksheet;

    async function findWorksheet() {
      const {
        data: { sheets },
      } = await $.http.get(`/v4/spreadsheets/${$.step.parameters.spreadsheetId}`);

      const selectedSheet = sheets.find(
        (sheet) => sheet.properties.title === $.step.parameters.title
      );

      return selectedSheet;
    }

    const selectedSheet = await findWorksheet();

    if (selectedSheet) {
      $.setActionItem({
        raw: selectedSheet,
      });

      return;
    }

    if (createWorksheet) {
      const headers = $.step.parameters.headers;
      const headerValues = headers.map((entry) => entry.header);

      const body = {
        requests: [
          {
            addSheet: {
              properties: {
                title: $.step.parameters.title,
              },
            },
          },
        ],
      };

      const { data } = await $.http.post(
        `/v4/spreadsheets/${$.step.parameters.spreadsheetId}:batchUpdate`,
        body
      );

      if (headerValues.length) {
        const body = {
          requests: [
            {
              updateCells: {
                rows: [
                  {
                    values: headerValues.map((header) => ({
                      userEnteredValue: { stringValue: header },
                    })),
                  },
                ],
                fields: '*',
                start: {
                  sheetId:
                    data.replies[data.replies.length - 1].addSheet.properties
                      .sheetId,
                  rowIndex: 0,
                  columnIndex: 0,
                },
              },
            },
          ],
        };

        await $.http.post(
          `/v4/spreadsheets/${$.step.parameters.spreadsheetId}:batchUpdate`,
          body
        );

        const createdSheet = await findWorksheet();

        $.setActionItem({
          raw: createdSheet,
        });

        return;
      }
    }

    $.setActionItem({
      raw: null,
    });
  },
});
