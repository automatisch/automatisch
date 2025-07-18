import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Update contact',
  key: 'updateContact',
  description: 'Updates an existing contact.',
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
    const contactId = $.step.parameters.contactId;
    const company = $.step.parameters.company;
    const email = $.step.parameters.email;
    const firstName = $.step.parameters.firstName;
    const lastName = $.step.parameters.lastName;
    const phone = $.step.parameters.phone;
    const website = $.step.parameters.website;
    const hubspotOwnerId = $.step.parameters.hubspotOwnerId;

    const properties = {};
    if (company !== undefined) properties.company = company;
    if (email !== undefined) properties.email = email;
    if (firstName !== undefined) properties.firstname = firstName;
    if (lastName !== undefined) properties.lastname = lastName;
    if (phone !== undefined) properties.phone = phone;
    if (website !== undefined) properties.website = website;
    if (hubspotOwnerId !== undefined)
      properties.hubspot_owner_id = hubspotOwnerId;

    const response = await $.http.patch(
      `/crm/v3/objects/contacts/${contactId}`,
      {
        properties,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
