export const fields = [
  {
    label: 'Name',
    key: 'name',
    type: 'string',
    required: true,
    description: '',
    variables: true,
  },
  {
    label: 'Assigned To',
    key: 'assignedTo',
    type: 'string',
    required: false,
    description: 'Default is the id of the account connected to Automatisch.',
    variables: true,
  },
  {
    label: 'Start Date & Time',
    key: 'startDateAndTime',
    type: 'string',
    required: false,
    description: 'Format: yyyy-mm-dd',
    variables: true,
  },
  {
    label: 'Due Date',
    key: 'dueDate',
    type: 'string',
    required: false,
    description: 'Format: yyyy-mm-dd',
    variables: true,
  },
  {
    label: 'Stage',
    key: 'stage',
    type: 'dropdown',
    required: true,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTodoOptions',
        },
        {
          name: 'parameters.stage',
          value: 'taskstatus',
        },
      ],
    },
  },
  {
    label: 'Contact',
    key: 'contactId',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listContacts',
        },
      ],
    },
  },
  {
    label: 'Priority',
    key: 'priority',
    type: 'dropdown',
    required: true,
    description: '',
    variables: true,
    options: [
      { label: 'High', value: 'High' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Low', value: 'Low' },
    ],
  },
  {
    label: 'Send Notification',
    key: 'sendNotification',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    options: [
      { label: 'True', value: 'true' },
      { label: 'False', value: 'false' },
    ],
  },
  {
    label: 'Location',
    key: 'location',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Record Currency',
    key: 'recordCurrencyId',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listRecordCurrencies',
        },
      ],
    },
  },
  {
    label: 'Milestone',
    key: 'milestone',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listMilestones',
        },
      ],
    },
  },
  {
    label: 'Previous Task',
    key: 'previousTask',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTasks',
        },
      ],
    },
  },
  {
    label: 'Parent Task',
    key: 'parentTask',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTasks',
        },
      ],
    },
  },
  {
    label: 'Task Type',
    key: 'taskType',
    type: 'dropdown',
    required: true,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTodoOptions',
        },
        {
          name: 'parameters.taskType',
          value: 'tasktype',
        },
      ],
    },
  },
  {
    label: 'Skipped Reason',
    key: 'skippedReason',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTodoOptions',
        },
        {
          name: 'parameters.skippedReason',
          value: 'skipped_reason',
        },
      ],
    },
  },
  {
    label: 'Estimate',
    key: 'estimate',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Related Task',
    key: 'relatedTask',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listTasks',
        },
      ],
    },
  },
  {
    label: 'Project',
    key: 'projectId',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listProjects',
        },
      ],
    },
  },
  {
    label: 'Organization',
    key: 'organizationId',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
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
    label: 'Send Email Reminder Before',
    key: 'sendEmailReminderBefore',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Description',
    key: 'description',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Is Billable',
    key: 'isBillable',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    options: [
      { label: 'True', value: '1' },
      { label: 'False', value: '-1' },
    ],
  },
  {
    label: 'Service',
    key: 'service',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listServices',
        },
      ],
    },
  },
  {
    label: 'Rate',
    key: 'rate',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'SLA',
    key: 'slaId',
    type: 'dropdown',
    required: false,
    description: '',
    variables: true,
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listSlaNames',
        },
      ],
    },
  },
];
