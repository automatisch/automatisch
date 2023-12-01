export default {
  name: 'List create worksheet fields',
  key: 'listCreateWorksheetFields',

  async run($) {
    if ($.step.parameters.createWorksheet) {
      return [
        {
          label: 'Headers',
          key: 'headers',
          type: 'dynamic',
          required: false,
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
      ];
    }
  },
};
