import defineTrigger from '../../../../helpers/define-trigger';
import newOrUpdatedSpreadsheetRows from './new-or-updated-spreadsheet-rows';

export default defineTrigger({
  name: 'New or updated spreadsheet rows',
  key: 'newOrUpdatedSpreadsheetRows',
  pollInterval: 15,
  description: 'Triggers when a new row is added or modified in a spreadsheet.',
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
    {
      label: 'Trigger Column',
      key: 'triggerColumnIndex',
      type: 'dropdown' as const,
      required: false,
      dependsOn: ['parameters.worksheetId'],
      description:
        'Triggers on changes to cells in this column only. Leave this field blank if you want the flow to trigger on changes to any cell within the row. Please note: All new rows will trigger the flow even if the Trigger column is empty.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listColumns',
          },
          {
            name: 'parameters.spreadsheetId',
            value: '{parameters.spreadsheetId}',
          },
          {
            name: 'parameters.worksheetId',
            value: '{parameters.worksheetId}',
          },
        ],
      },
    },
  ],

  async run($) {
    await newOrUpdatedSpreadsheetRows($);
  },
});
