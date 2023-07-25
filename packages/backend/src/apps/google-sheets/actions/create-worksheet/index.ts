import { IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';

type THeaders = {
  __id: string;
  header: string;
}[];

type TSheetsResponse = {
  sheets: {
    properties: {
      sheetId: string;
      title: string;
    };
  }[];
};

type TBody = {
  requests: IJSONObject[];
};

export default defineAction({
  name: 'Create worksheet',
  key: 'createWorksheet',
  description:
    'Create a blank worksheet with a title. Optionally, provide headers.',
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
      type: 'string' as const,
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Headers',
      key: 'headers',
      type: 'dynamic' as const,
      required: false,
      fields: [
        {
          label: 'Header',
          key: 'header',
          type: 'string' as const,
          required: true,
          variables: true,
        },
      ],
    },
    {
      label: 'Overwrite',
      key: 'overwrite',
      type: 'dropdown' as const,
      required: false,
      value: false,
      description:
        'If a worksheet with the specified title exists, its content would be lost. Please, use with caution.',
      variables: true,
      options: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
    },
  ],

  async run($) {
    const {
      data: { sheets },
    } = await $.http.get<TSheetsResponse>(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}`
    );
    const selectedSheet = sheets.find(
      (sheet) => sheet.properties.title === $.step.parameters.title
    );
    const headers = $.step.parameters.headers as THeaders;
    const values = headers.map((entry) => entry.header);

    const body: TBody = {
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

    if ($.step.parameters.overwrite === 'true' && selectedSheet) {
      body.requests.unshift({
        deleteSheet: {
          sheetId: selectedSheet.properties.sheetId,
        },
      });
    }

    const { data } = await $.http.post(
      `https://sheets.googleapis.com/v4/spreadsheets/${$.step.parameters.spreadsheetId}:batchUpdate`,
      body
    );

    if (values.length) {
      const body = {
        requests: [
          {
            updateCells: {
              rows: [
                {
                  values: values.map((header) => ({
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

      const { data: response } = await $.http.post(
        `https://sheets.googleapis.com/v4/spreadsheets/${$.step.parameters.spreadsheetId}:batchUpdate`,
        body
      );

      $.setActionItem({
        raw: response,
      });
      return;
    }

    $.setActionItem({
      raw: data,
    });
  },
});
