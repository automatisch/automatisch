export const fields = [
  {
    label: 'Name',
    key: 'name',
    type: 'string' as const,
    required: true,
    variables: true,
    description: '',
  },
  {
    label: 'Email',
    key: 'email',
    type: 'string' as const,
    required: true,
    variables: true,
    description:
      'It is essential to be distinctive. Zendesk prohibits the existence of identical users sharing the same email address.',
  },
  {
    label: 'Details',
    key: 'details',
    type: 'string' as const,
    required: false,
    variables: true,
    description: '',
  },
  {
    label: 'Notes',
    key: 'notes',
    type: 'string' as const,
    required: false,
    variables: true,
    description:
      'Within this field, you have the capability to save any remarks or comments you may have concerning the user.',
  },
  {
    label: 'Phone',
    key: 'phone',
    type: 'string' as const,
    required: false,
    variables: true,
    description:
      "The user's contact number should be entered in the following format: +1 (555) 123-4567.",
  },
  {
    label: 'Tags',
    key: 'tags',
    type: 'string' as const,
    required: false,
    variables: true,
    description: 'A comma separated list of tags.',
  },
  {
    label: 'Role',
    key: 'role',
    type: 'string' as const,
    required: false,
    variables: true,
    description:
      "It can take on one of the designated roles: 'end-user', 'agent', or 'admin'. If a different value is set or none is specified, the default is 'end-user.'",
  },
  {
    label: 'Organization',
    key: 'organizationId',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: 'Assign this user to a specific organization.',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listOrganizations',
        },
      ],
    },
  },
  {
    label: 'External Id',
    key: 'externalId',
    type: 'string' as const,
    required: false,
    variables: true,
    description:
      'An exclusive external identifier; you can utilize this to link organizations with an external record.',
  },
  {
    label: 'Verified',
    key: 'verified',
    type: 'dropdown' as const,
    required: false,
    description:
      "Specify if you can verify that the user's assertion of their identity is accurate.",
    variables: true,
    options: [
      { label: 'True', value: 'true' },
      { label: 'False', value: 'false' },
    ],
  },
];
