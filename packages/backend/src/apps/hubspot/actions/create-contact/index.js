import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create contact',
  key: 'createContact',
  description: `Create contact on user's account.`,
  arguments: [
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
    const company = $.step.parameters.company;
    const email = $.step.parameters.email;
    const firstName = $.step.parameters.firstName;
    const lastName = $.step.parameters.lastName;
    const phone = $.step.parameters.phone;
    const website = $.step.parameters.website;
    const hubspotOwnerId = $.step.parameters.hubspotOwnerId;

    const response = await $.http.post(`crm/v3/objects/contacts`, {
      properties: {
        company,
        email,
        firstname: firstName,
        lastname: lastName,
        phone,
        website,
        hubspot_owner_id: hubspotOwnerId,
      },
    });

    $.setActionItem({ raw: response.data });
  },
});
