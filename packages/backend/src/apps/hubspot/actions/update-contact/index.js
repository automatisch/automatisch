import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Update contact',
  key: 'updateContact',
  description: `Updates an existing contact on user's account.`,
  arguments: [
    {
      label: 'Contact ID',
      key: 'contactId',
      type: 'string',
      required: true,
      variables: true,
    },
    {
      label: 'Company name',
      key: 'company',
      type: 'string',
      required: false,
      variables: true,
    },
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: false,
      variables: true,
    },
    {
      label: 'First name',
      key: 'firstName',
      type: 'string',
      required: false,
      variables: true,
    },
    {
      label: 'Last name',
      key: 'lastName',
      type: 'string',
      required: false,
      description: 'Last name',
      variables: true,
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'string',
      required: false,
      variables: true,
    },
    {
      label: 'Website URL',
      key: 'website',
      type: 'string',
      required: false,
      variables: true,
    },
    {
      label: 'Owner ID',
      key: 'hubspotOwnerId',
      type: 'string',
      required: false,
      variables: true,
    },
  ],

  async run($) {
    const {
      contactId,
      company,
      email,
      firstName,
      lastName,
      phone,
      website,
      hubspotOwnerId,
    } = $.step.parameters;

    const response = await $.http.patch(
      `crm/v3/objects/contacts/${contactId}`,
      {
        properties: {
          company,
          email,
          firstname: firstName,
          lastname: lastName,
          phone,
          website,
          hubspot_owner_id: hubspotOwnerId,
        },
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
