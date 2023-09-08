import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create contact',
  key: 'createContact',
  description: `Create contact on user's account.`,
  arguments: [
    {
      label: 'Company',
      key: 'company',
      type: 'string' as const,
      required: false,
      description: 'company name',
      variables: true,
    },
    {
      label: 'E-mail',
      key: 'email',
      type: 'string' as const,
      required: false,
      description: 'Contact email',
      variables: true,
    },
    {
      label: 'First name',
      key: 'firstname',
      type: 'string' as const,
      required: false,
      description: 'Contact First name',
      variables: true,
    },
    {
      label: 'Last name',
      key: 'lastname',
      type: 'string' as const,
      required: false,
      description: 'Contact Last name',
      variables: true,
    },
    {
      label: 'Phone',
      key: 'phone',
      type: 'string' as const,
      required: false,
      description: 'Contact phone number',
      variables: true,
    },
    {
      label: 'Webiste URL',
      key: 'website',
      type: 'string' as const,
      required: false,
      description: 'Contact Webiste URL',
      variables: true,
    },
    {
      label: 'Owner ID',
      key: 'hubspot_owner_id',
      type: 'string' as const,
      required: false,
      description: 'Contact Owner ID',
      variables: true,
    },
  ],

  async run($) {
    const company = $.step.parameters.company as string;
    const email = $.step.parameters.email as string;
    const firstname = $.step.parameters.firstname as string;
    const lastname = $.step.parameters.lastname as string;
    const phone = $.step.parameters.phone as string;
    const website = $.step.parameters.website as string;
    const hubspot_owner_id = $.step.parameters.hubspot_owner_id as string;

    const response = await $.http.post(`crm/v3/objects/contacts`, {
      properties: {
        company,
        email,
        firstname,
        lastname,
        phone,
        website,
        hubspot_owner_id,
      },
    });

    $.setActionItem({ raw: response.data });
  },
});
