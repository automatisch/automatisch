const trimWhitespace = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'Text you want to remove leading and trailing spaces.',
    variables: true,
  },
];

export default trimWhitespace;
