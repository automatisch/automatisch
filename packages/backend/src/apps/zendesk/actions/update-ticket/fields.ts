export const fields = [
  {
    label: 'Ticket',
    key: 'ticketId',
    type: 'dropdown' as const,
    required: true,
    variables: true,
    description: 'Select the ticket you want to change.',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listFirstPageOfTickets',
        },
      ],
    },
  },
  {
    label: 'Subject',
    key: 'subject',
    type: 'string' as const,
    required: false,
    variables: true,
    description: '',
  },
  {
    label: 'Assignee',
    key: 'assigneeId',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description:
      'Note: An error occurs if the assignee is not in the default group (or the specific group chosen below).',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listUsers',
        },
        {
          name: 'parameters.showUserRole',
          value: 'true',
        },
        {
          name: 'parameters.includeAdmins',
          value: 'true',
        },
      ],
    },
  },
  {
    label: 'Group',
    key: 'groupId',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: 'Allocate this ticket to a specific group.',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listGroups',
        },
      ],
    },
  },
  {
    label: 'New Status',
    key: 'status',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: '',
    options: [
      { label: 'New', value: 'new' },
      { label: 'Open', value: 'open' },
      { label: 'Pending', value: 'pending' },
      { label: 'Hold', value: 'hold' },
      { label: 'Solved', value: 'solved' },
      { label: 'Closed', value: 'closed' },
    ],
  },
  {
    label: 'New comment to add to the ticket',
    key: 'comment',
    type: 'string' as const,
    required: false,
    variables: true,
    description: '',
  },
  {
    label: 'Should the first comment be public?',
    key: 'publicOrNot',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: '',
    options: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
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
    label: 'Type',
    key: 'type',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: '',
    options: [
      { label: 'Problem', value: 'problem' },
      { label: 'Incident', value: 'incident' },
      { label: 'Question', value: 'question' },
      { label: 'Task', value: 'task' },
    ],
  },
  {
    label: 'Priority',
    key: 'priority',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: '',
    options: [
      { label: 'Urgent', value: 'urgent' },
      { label: 'High', value: 'high' },
      { label: 'Normal', value: 'normal' },
      { label: 'Low', value: 'low' },
    ],
  },
  {
    label: 'Submitter',
    key: 'submitterId',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: '',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listUsers',
        },
        {
          name: 'parameters.includeAdmins',
          value: 'false',
        },
      ],
    },
  },
];
