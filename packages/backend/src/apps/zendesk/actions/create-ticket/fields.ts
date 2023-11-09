export const fields = [
  {
    label: 'Subject',
    key: 'subject',
    type: 'string' as const,
    required: true,
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
    label: 'Collaborators',
    key: 'collaborators',
    type: 'dynamic' as const,
    required: false,
    description: '',
    fields: [
      {
        label: 'Collaborator',
        key: 'collaborator',
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
              value: 'true',
            },
          ],
        },
      },
    ],
  },
  {
    label: 'Collaborator Emails',
    key: 'collaboratorEmails',
    type: 'dynamic' as const,
    required: false,
    description:
      'You have the option to include individuals who are not Zendesk users as Collaborators by adding their email addresses here.',
    fields: [
      {
        label: 'Collaborator Email',
        key: 'collaboratorEmail',
        type: 'string' as const,
        required: false,
        variables: true,
        description: '',
      },
    ],
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
    label: 'Requester Name',
    key: 'requesterName',
    type: 'string' as const,
    required: false,
    variables: true,
    description:
      'To specify the Requester, you need to fill in the Requester Name in this field and provide the Requestor Email in the next field.',
  },
  {
    label: 'Requester Email',
    key: 'requesterEmail',
    type: 'string' as const,
    required: false,
    variables: true,
    description:
      'To specify the Requester, you need to fill in the Requester Email in this field and provide the Requestor Name in the previous field.',
  },
  {
    label: 'First Comment/Description Format',
    key: 'format',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description: '',
    options: [
      { label: 'Plain Text', value: 'Plain Text' },
      { label: 'HTML', value: 'HTML' },
    ],
  },
  {
    label: 'First Comment/Description',
    key: 'comment',
    type: 'string' as const,
    required: true,
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
    label: 'Status',
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
    label: 'Due At',
    key: 'dueAt',
    type: 'string' as const,
    required: false,
    variables: true,
    description: 'Limited to tickets typed as "task".',
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
  {
    label: 'Ticket Form',
    key: 'ticketForm',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description:
      'When chosen, this will configure the form displayed for this ticket. Note: This field is solely relevant for Zendesk enterprise accounts.',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTicketForms',
        },
      ],
    },
  },
  {
    label: 'Sharing Agreements',
    key: 'sharingAgreements',
    type: 'dynamic' as const,
    required: false,
    description: '',
    fields: [
      {
        label: 'Sharing Agreement',
        key: 'sharingAgreement',
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
              value: 'listSharingAgreements',
            },
          ],
        },
      },
    ],
  },
  {
    label: 'Brand',
    key: 'brandId',
    type: 'dropdown' as const,
    required: false,
    variables: true,
    description:
      'This applies exclusively to Zendesk customers subscribed to plans that include multi-brand support.',
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listBrands',
        },
      ],
    },
  },
];
