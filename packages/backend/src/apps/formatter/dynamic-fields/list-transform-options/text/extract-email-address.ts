const extractEmailAddress = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'Text that will be searched for an email address.',
    variables: true,
  },
];

export default extractEmailAddress;
