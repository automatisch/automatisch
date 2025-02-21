const performMathOperation = [
  {
    label: 'Math Operation',
    key: 'mathOperation',
    type: 'dropdown',
    required: true,
    description: 'The math operation to perform.',
    variables: false,
    options: [
      { label: 'Add', value: 'add' },
      { label: 'Divide', value: 'divide' },
      { label: 'Make Negative', value: 'makeNegative' },
      { label: 'Modulo', value: 'modulo' },
      { label: 'Multiply', value: 'multiply' },
      { label: 'Subtract', value: 'subtract' },
    ],
  },
  {
    label: 'Values',
    key: 'values',
    type: 'dynamic',
    required: false,
    description: 'Add or remove numbers as needed.',
    fields: [
      {
        label: 'Input',
        key: 'input',
        type: 'string',
        required: true,
        description: 'The number to perform the math operation on.',
        variables: true,
      },
    ],
  },
];

export default performMathOperation;
