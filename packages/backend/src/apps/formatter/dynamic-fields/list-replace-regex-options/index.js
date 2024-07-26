export default {
  name: 'List replace regex options',
  key: 'listReplaceRegexOptions',

  async run($) {
    if (!$.step.parameters.useRegex) return [];

    return [
      {
        label: 'Ignore case',
        key: 'ignoreCase',
        type: 'dropdown',
        required: true,
        description: 'Ignore case sensitivity.',
        variables: true,
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false },
        ],
      },
    ];
  },
};
