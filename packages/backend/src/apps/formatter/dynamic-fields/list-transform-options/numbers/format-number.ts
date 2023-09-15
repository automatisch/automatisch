const formatNumber = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'The number you want to format.',
    variables: true,
  },
  {
    label: 'Input Decimal Mark',
    key: 'inputDecimalMark',
    type: 'dropdown' as const,
    required: true,
    description: 'The decimal mark of the input number.',
    variables: true,
    options: [
      { label: 'Comma', value: ',' },
      { label: 'Period', value: '.' },
    ],
  },
  {
    label: 'To Format',
    key: 'toFormat',
    type: 'dropdown' as const,
    required: true,
    description: 'The format you want to convert the number to.',
    variables: true,
    options: [
      { label: 'Comma for grouping & period for decimal', value: '0' },
      { label: 'Period for grouping & comma for decimal', value: '1' },
      { label: 'Space for grouping & period for decimal', value: '2' },
      { label: 'Space for grouping & comma for decimal', value: '3' },
    ],
  },
];

export default formatNumber;
