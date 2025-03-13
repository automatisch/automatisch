const compare = [
  {
    label: 'List1',
    key: 'list1',
    type: 'string',
    required: true,
    description: 'List 1 that you want to compare against',
    variables: true,
  },
  {
    label: 'Matching Field',
    key: 'field1',
    type: 'string',
    required: true,
    description: 'Enter a field in list 1 to match against, case insensitive - i.e. Email, ID, etc. ',
    variables: true,
  },
  {
    label: 'List2',
    key: 'list2',
    type: 'string',
    required: false,
    description: 'List 2 that you want to compare rows with',
    variables: true,
  },
  
  {
    label: 'Matching Field',
    key: 'field2',
    type: 'string',
    required: true,
    description: 'Enter a field in list 2 to match against, case insensitive - i.e. Email, ID, etc.',
    variables: true,
  },
];

export default compare;
