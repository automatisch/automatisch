export const fields = [
  {
    label: 'Summary',
    key: 'summary',
    type: 'string',
    required: true,
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
    label: 'Case Title',
    key: 'caseTitle',
    type: 'string',
    required: true,
    description: '',
    variables: true,
  },
  {
    label: 'Status',
    key: 'status',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.status',
          value: 'casestatus',
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
    source: {
      type: 'query',
      name: 'getDynamicData',
      arguments: [
        {
          name: 'key',
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.priority',
          value: 'casepriority',
        },
      ],
    },
  },
  {
    label: 'Contact',
    key: 'contactId',
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
          value: 'listContacts',
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
    label: 'Group',
    key: 'groupId',
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
          value: 'listGroups',
        },
      ],
    },
  },
  {
    label: 'Assigned To',
    key: 'assignedTo',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Product',
    key: 'productId',
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
          value: 'listProducts',
        },
      ],
    },
  },
  {
    label: 'Channel',
    key: 'channel',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.channel',
          value: 'casechannel',
        },
      ],
    },
  },
  {
    label: 'Resolution',
    key: 'resolution',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Category',
    key: 'category',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.category',
          value: 'impact_type',
        },
      ],
    },
  },
  {
    label: 'Sub Category',
    key: 'subCategory',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.subCategory',
          value: 'impact_area',
        },
      ],
    },
  },
  {
    label: 'Resolution Type',
    key: 'resolutionType',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.resolutionType',
          value: 'resolution_type',
        },
      ],
    },
  },
  {
    label: 'Deferred Date',
    key: 'deferredDate',
    type: 'string',
    required: false,
    description: 'format: yyyy-mm-dd',
    variables: true,
  },
  {
    label: 'Service Contract',
    key: 'serviceContractId',
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
          value: 'listServiceContracts',
        },
      ],
    },
  },
  {
    label: 'Asset',
    key: 'assetId',
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
          value: 'listAssets',
        },
      ],
    },
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
    label: 'Service Type',
    key: 'serviceType',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.serviceType',
          value: 'servicetype',
        },
      ],
    },
  },
  {
    label: 'Service Location',
    key: 'serviceLocation',
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
          value: 'listCaseOptions',
        },
        {
          name: 'parameters.serviceLocation',
          value: 'servicelocation',
        },
      ],
    },
  },
  {
    label: 'Work Location',
    key: 'workLocation',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
];
