import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create company',
  key: 'createCompany',
  description: 'Creates a new company.',
  arguments: [
    {
      label: 'Company Owner',
      key: 'companyOwnerId',
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
            value: 'listContactOwners',
          },
        ],
      },
    },
    {
      label: 'Company Name',
      key: 'companyName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Website',
      key: 'website',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Tags',
      key: 'tags',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Tag',
          key: 'tag',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
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
      label: 'Billing Street',
      key: 'billingStreet',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Billing City',
      key: 'billingCity',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Billing State',
      key: 'billingState',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Billing Country',
      key: 'billingCountry',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Billing Code',
      key: 'billingCode',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const {
      contactOwnerId,
      companyName,
      phone,
      website,
      tags,
      description,
      billingStreet,
      billingCity,
      billingState,
      billingCountry,
      billingCode,
    } = $.step.parameters;

    const allTags = tags.map((tag) => ({
      name: tag.tag,
    }));

    const body = {
      data: [
        {
          Owner: {
            id: contactOwnerId,
          },
          Account_Name: companyName,
          Phone: phone,
          Website: website,
          Tag: allTags,
          Description: description,
          Billing_Street: billingStreet,
          Billing_City: billingCity,
          Billing_State: billingState,
          Billing_Country: billingCountry,
          Billing_Code: billingCode,
        },
      ],
    };

    const { data } = await $.http.post(`/bigin/v2/Accounts`, body);

    $.setActionItem({
      raw: data[0],
    });
  },
});
