const compareMerge = [
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
    label: 'Merge Fields',
    key: 'merge1',
    type: 'string',
    required: true,
    description: `Enter a list of fields from list 1 separated by , to be included within the curated list after a successful match, case insensitive - i.e. ID, Status, etc.
    Note: Write "NONE" for no fields to be included or "ALL" for all fields from list 1 to be included in the curated list.`,
    variables: true,
  },
  {
    label: 'Prefix Field - Optional',
    key: 'prefix1',
    type: 'string',
    required: false,
    description: 'Include a prefix to chosen list1 fields within the curated list for example ID field with prefix "Clockify" will result in "Clockify-ID" within the curated list',
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
  {
    label: 'Merge Fields',
    key: 'merge2',
    type: 'string',
    required: true,
    description: `Enter a list of fields from list 2 separated by , to be included within the curated list after a successful match, case insensitive - i.e. ID, Status, etc.
    Note: Write "NONE" for no fields to be included or "ALL" for all fields from list 2 to be included in the curated list.`,
    variables: true,
  },
  {
    label: 'Prefix Field - Optional',
    key: 'prefix2',
    type: 'string',
    required: false,
    description: 'Include a prefix to chosen list2 fields within the curated list for example ID field with prefix "Xero" will result in "Xero-ID" within the curated list',
    variables: true,
  },
  {
    label: 'Include Matching Field - Optional',
    key: 'includeMatchField',
    type: 'string',
    required: false,
    description: 'If populated, the matching field will be included within the curated list with the label as entered',
    variables: true,
  },
];

export default compareMerge;
