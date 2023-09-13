const useDefaultValue = [
  {
    label: 'Input',
    key: 'input',
    type: 'string' as const,
    required: true,
    description: 'Text you want to check whether it is empty or not.',
    variables: true,
  },
  {
    label: 'Default Value',
    key: 'defaultValue',
    type: 'string' as const,
    required: true,
    description:
      'Text that will be used as a default value if the input is empty.',
    variables: true,
  },
];

export default useDefaultValue;
