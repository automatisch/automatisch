import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create contact',
  key: 'createContact',
  description: `Create contact on user's account.`,
  arguments: [
    {
      label: 'Company name',
      key: 'company',
      type: 'string' as const,
      required: false,
      variables: true,
    },
    {
      label: 'Email',
      key: 'email',
      type: 'string' as const,
      required: false,
      variables: true,
    },
    {
      label: 'First name',
      key: 'firstName',
      type: 'string' as const,
      required: false,
      variables: true,
    },
    {
      label: 'Last name',
      key: 'lastName',
      type: 'string' as const,
      required: false,
      description: 'Last name',
      variables: true,
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'string' as const,
      required: false,
      variables: true,
    },
    {
      label: 'Website URL',
      key: 'website',
      type: 'string' as const,
      required: false,
      variables: true,
    },
    {
      label: 'Owner ID',
      key: 'hubspotOwnerId',
      type: 'string' as const,
      required: false,
      variables: true,
    },
  ],

  async run($) {
    const company = $.step.parameters.company as string;
    const email = $.step.parameters.email as string;
    const firstName = $.step.parameters.firstName as string;
    const lastName = $.step.parameters.lastName as string;
    const phone = $.step.parameters.phone as string;
    const website = $.step.parameters.website as string;
    const hubspotOwnerId = $.step.parameters.hubspotOwnerId as string;

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
