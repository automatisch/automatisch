const extractNumber = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'Text that will be searched for a number.',
    variables: true,
  },
];

export default extractNumber;
