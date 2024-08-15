const replace = [
  {
    label: 'Input',
    key: 'input',
    type: 'string',
    required: true,
    description: 'Text that you want to search for and replace values.',
    variables: true,
  },
  {
    label: 'Find',
    key: 'find',
    type: 'string',
    required: true,
    description: 'Text that will be searched for.',
    variables: true,
  },
  {
    label: 'Replace',
    key: 'replace',
    type: 'string',
    required: false,
    description: 'Text that will replace the found text.',
    variables: true,
  },
  {
    label: 'Use Regular Expression',
    key: 'useRegex',
    type: 'dropdown',
    required: true,
    description: 'Use regex to search values.',
    variables: true,
    value: false,
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
          value: 'listReplaceRegexOptions',
        },
        {
          name: 'parameters.useRegex',
          value: '{parameters.useRegex}',
        },
      ],
    },
  },
];

export default replace;
