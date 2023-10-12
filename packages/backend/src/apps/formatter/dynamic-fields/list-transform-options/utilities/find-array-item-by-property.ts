const findArrayItemByProperty = [
  {
    label: 'Value',
    key: 'value',
    type: 'string' as const,
    required: true,
    description: 'Array of objects that will be searched.',
    variables: true,
  },
  {
    label: 'Property Name',
    key: 'propertyName',
    type: 'string' as const,
    required: true,
    description: 'Property name that will be searched.',
    variables: true,
  },
  {
    label: 'Property Value',
    key: 'propertyValue',
    type: 'string' as const,
    required: true,
    description: 'Property value that will be matched.',
    variables: true,
  },
];

export default findArrayItemByProperty;
