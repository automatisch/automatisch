import defineAction from '../../../../helpers/define-action.js';
import { filterProvidedFields } from '../../common/filter-provided-fields.js';

export default defineAction({
  name: 'Create lead',
  key: 'createLead',
  description: 'Creates a new lead.',
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
      label: 'Person',
      key: 'personId',
      type: 'dropdown',
      required: false,
      description:
        'Lead must be associated with at least one person or organization.',
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
      label: 'Organization',
      key: 'organizationId',
      type: 'dropdown',
      required: false,
      description:
        'Lead must be associated with at least one person or organization.',
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
      label: 'Owner',
      key: 'ownerId',
      type: 'dropdown',
      required: false,
      description:
        'Select user who will be marked as the owner of this lead. If omitted, the authorized user will be used.',
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
      label: 'Lead Labels',
      key: 'labelIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Label',
          key: 'leadLabelId',
          type: 'dropdown',
          required: false,
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listLeadLabels',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Expected Close Date',
      key: 'expectedCloseDate',
      type: 'string',
      required: false,
      description: 'E.g. 2023-10-23',
      variables: true,
    },
    {
      label: 'Lead Value',
      key: 'value',
      type: 'string',
      required: false,
      description: 'E.g. 150',
      variables: true,
    },
    {
      label: 'Lead Value Currency',
      key: 'currency',
      type: 'dropdown',
      required: false,
      description: 'This field is required if a Lead Value amount is provided.',
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
      personId,
      organizationId,
      ownerId,
      labelIds,
      expectedCloseDate,
      value,
      currency,
    } = $.step.parameters;

    const onlyLabelIds = labelIds
      .map((labelId) => labelId.leadLabelId)
      .filter(Boolean);

    const labelValue = {};

    if (value) {
      labelValue.amount = Number(value);
    }
    if (currency) {
      labelValue.currency = currency;
    }

    const fields = {
      title: title,
      person_id: Number(personId),
      organization_id: Number(organizationId),
      owner_id: Number(ownerId),
      expected_close_date: expectedCloseDate,
      label_ids: onlyLabelIds,
      value: labelValue,
    };

    const body = filterProvidedFields(fields);

    const {
      data: { data },
    } = await $.http.post('/api/v1/leads', body);

    $.setActionItem({
      raw: data,
    });
  },
});
