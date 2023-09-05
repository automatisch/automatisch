const randomNumber = [
  {
    label: 'Lower range',
    key: 'lowerRange',
    type: 'string' as const,
    required: true,
    description: 'The lowest number to generate.',
    variables: true,
  },
  {
    label: 'Upper range',
    key: 'upperRange',
    type: 'string' as const,
    required: true,
    description: 'The highest number to generate.',
    variables: true,
  },
];

export default randomNumber;
