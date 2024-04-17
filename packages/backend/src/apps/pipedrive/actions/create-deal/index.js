import defineAction from '../../../../helpers/define-action.js';
import { filterProvidedFields } from '../../common/filter-provided-fields.js';

export default defineAction({
  name: 'Create deal',
  key: 'createDeal',
  description: 'Creates a new deal.',
  arguments: [
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Creation Date',
      key: 'addTime',
      type: 'string',
      required: false,
      description:
        'Requires admin access to Pipedrive account. Format: YYYY-MM-DD HH:MM:SS',
      variables: true,
    },
    {
      label: 'Status',
      key: 'status',
      type: 'dropdown',
      required: false,
      description: '',
      options: [
        {
          label: 'Open',
          value: 'open',
        },
        {
          label: 'Won',
          value: 'won',
        },
        {
          label: 'Lost',
          value: 'lost',
        },
        {
          label: 'Deleted',
          value: 'deleted',
        },
      ],
    },
    {
      label: 'Lost Reason',
      key: 'lostReason',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Stage',
      key: 'stageId',
      type: 'dropdown',
      required: false,
      value: '1',
      description:
        'The ID of the stage this deal will be added to. If omitted, the deal will be placed in the first stage of the default pipeline.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listStages',
          },
        ],
      },
    },
    {
      label: 'Owner',
      key: 'userId',
      type: 'dropdown',
      required: false,
      description:
        'Select user who will be marked as the owner of this deal. If omitted, the authorized user will be used.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
        ],
      },
    },
    {
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown',
      required: false,
      description: 'Organization this deal will be associated with.',
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
      label: 'Person',
      key: 'personId',
      type: 'dropdown',
      required: false,
      description: 'Person this deal will be associated with.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listPersons',
          },
        ],
      },
    },
    {
      label: 'Probability',
      key: 'probability',
      type: 'string',
      required: false,
      description:
        'The success probability percentage of the deal. Used/shown only when deal_probability for the pipeline of the deal is enabled.',
      variables: true,
    },
    {
      label: 'Expected Close Date',
      key: 'expectedCloseDate',
      type: 'string',
      required: false,
      description:
        'The expected close date of the deal. In ISO 8601 format: YYYY-MM-DD.',
      variables: true,
    },
    {
      label: 'Value',
      key: 'value',
      type: 'string',
      required: false,
      description: 'The value of the deal. If omitted, value will be set to 0.',
      variables: true,
    },
    {
      label: 'Currency',
      key: 'currency',
      type: 'dropdown',
      required: false,
      description:
        'The currency of the deal. Accepts a 3-character currency code. If omitted, currency will be set to the default currency of the authorized user.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCurrencies',
          },
        ],
      },
    },
  ],

  async run($) {
    const {
      title,
      addTime,
      status,
      lostReason,
      stageId,
      userId,
      organizationId,
      personId,
      probability,
      expectedCloseDate,
      value,
      currency,
    } = $.step.parameters;

    const fields = {
      title: title,
      value: value,
      add_time: addTime,
      status: status,
      lost_reason: lostReason,
      stage_id: stageId,
      user_id: userId,
      org_id: organizationId,
      person_id: personId,
      probability: probability,
      expected_close_date: expectedCloseDate,
      currency: currency,
    };

    const body = filterProvidedFields(fields);

    const {
      data: { data },
    } = await $.http.post('/api/v1/deals', body);

    $.setActionItem({
      raw: data,
    });
  },
});
