const lowercase = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'Text that will be lowercased.',
    variables: true,
  },
];

export default lowercase;
