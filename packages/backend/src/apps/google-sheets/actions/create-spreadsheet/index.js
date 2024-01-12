import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create spreadsheet',
  key: 'createSpreadsheet',
  description:
    'Create a blank spreadsheet or duplicate an existing spreadsheet. Optionally, provide headers.',
  arguments: [
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Spreadsheet to copy',
      key: 'spreadsheetId',
      type: 'dropdown',
      required: false,
      description: 'Choose a spreadsheet to copy its data.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSpreadsheets',
          },
        ],
      },
    },
    {
      label: 'Headers',
      key: 'headers',
      type: 'dynamic',
      required: false,
      description:
        'These headers are ignored if "Spreadsheet to Copy" is selected.',
      fields: [
        {
          label: 'Header',
          key: 'header',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
  ],

  async run($) {
    if ($.step.parameters.spreadsheetId) {
      const body = { name: $.step.parameters.title };

      const { data } = await $.http.post(
        `https://www.googleapis.com/drive/v3/files/${$.step.parameters.spreadsheetId}/copy`,
        body
      );

      $.setActionItem({
        raw: data,
      });
    } else {
      const headers = $.step.parameters.headers;
      const values = headers.map((entry) => entry.header);

      const spreadsheetBody = {
        properties: {
          title: $.step.parameters.title,
        },
        sheets: [
          {
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: values.map((header) => ({
                      userEnteredValue: { stringValue: header },
                    })),
                  },
                ],
              },
            ],
          },
        ],
      };

      const { data } = await $.http.post('/v4/spreadsheets', spreadsheetBody);

      $.setActionItem({
        raw: data,
      });
    }
  },
});
