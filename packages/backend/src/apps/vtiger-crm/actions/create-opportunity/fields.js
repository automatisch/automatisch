export const fields = [
  {
    label: 'Deal Name',
    key: 'dealName',
    type: 'string',
    required: true,
    description: '',
    variables: true,
  },
  {
    label: 'Amount',
    key: 'amount',
    type: 'string',
    required: false,
    description: '',
    variables: true,
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
    label: 'Expected Close Date',
    key: 'expectedCloseDate',
    type: 'string',
    required: true,
    description: 'Format: yyyy-mm-dd',
    variables: true,
  },
  {
    label: 'Pipeline',
    key: 'pipeline',
    type: 'dropdown',
    required: true,
    value: 'Standart',
    description: '',
    variables: true,
    options: [{ label: 'Standart', value: 'Standart' }],
  },
  {
    label: 'Sales Stage',
    key: 'salesStage',
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
          value: 'listOpportunityOptions',
        },
        {
          name: 'parameters.salesStage',
          value: 'sales_stage',
        },
      ],
    },
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
    label: 'Lead Source',
    key: 'leadSource',
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
          value: 'listOpportunityOptions',
        },
        {
          name: 'parameters.leadSource',
          value: 'leadsource',
        },
      ],
    },
  },
  {
    label: 'Next Step',
    key: 'nextStep',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Type',
    key: 'type',
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
          value: 'listOpportunityOptions',
        },
        {
          name: 'parameters.type',
          value: 'opportunity_type',
        },
      ],
    },
  },
  {
    label: 'Probability',
    key: 'probability',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Campaign Source',
    key: 'campaignSourceId',
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
          value: 'listCampaignSources',
        },
      ],
    },
  },
  {
    label: 'Weighted Revenue',
    key: 'weightedRevenue',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Adjusted Amount',
    key: 'adjustedAmount',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
  {
    label: 'Lost Reason',
    key: 'lostReason',
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
          value: 'listOpportunityOptions',
        },
        {
          name: 'parameters.lostReason',
          value: 'lost_reason',
        },
      ],
    },
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
    label: 'Description',
    key: 'description',
    type: 'string',
    required: false,
    description: '',
    variables: true,
  },
];
