import defineTrigger from '../../../../helpers/define-trigger';
import newSpreadsheetRows from './new-spreadsheet-rows';

export default defineTrigger({
  name: 'New spreadsheet rows',
  key: 'newSpreadsheetRows',
  pollInterval: 15,
  description:
    'Triggers when a new row is added to the bottom of a spreadsheet.',
  arguments: [
    {
      label: 'Drive',
      key: 'driveId',
      type: 'dropdown' as const,
      required: false,
      description:
        'The Google Drive where your spreadsheet resides. If nothing is selected, then your personal Google Drive will be used.',
      variables: false,
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
      variables: false,
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
      description:
        'The worksheets in your selected spreadsheet. You must have column headers.',
      variables: false,
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
    },
  ],

  async run($) {
    await newSpreadsheetRows($);
  },
});
