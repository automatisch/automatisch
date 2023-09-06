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
  {
    label: 'Decimal points',
    key: 'decimalPoints',
    type: 'string' as const,
    required: false,
    description:
      'The number of digits after the decimal point. It can be an integer between 0 and 15.',
    variables: true,
  },
];

export default randomNumber;
