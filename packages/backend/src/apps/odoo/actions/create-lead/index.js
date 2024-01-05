import defineAction from '../../../../helpers/define-action.js';
import { authenticate, asyncMethodCall } from '../../common/xmlrpc-client.js';

export default defineAction({
  name: 'Create Lead',
  key: 'createLead',
  description: '',
  arguments: [
    {
      label: 'Name',
      key: 'name',
      type: 'string',
      required: true,
      description: 'Lead name',
      variables: true,
    },
    {
      label: 'Type',
      key: 'type',
      type: 'dropdown',
      required: true,
      variables: true,
      options: [
        {
          label: 'Lead',
          value: 'lead',
        },
        {
          label: 'Opportunity',
          value: 'opportunity',
        },
      ],
    },
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: false,
      description: 'Email of lead contact',
      variables: true,
    },
    {
      label: 'Contact Name',
      key: 'contactName',
      type: 'string',
      required: false,
      description: 'Name of lead contact',
      variables: true,
    },
    {
      label: 'Phone Number',
      key: 'phoneNumber',
      type: 'string',
      required: false,
      description: 'Phone number of lead contact',
      variables: true,
    },
    {
      label: 'Mobile Number',
      key: 'mobileNumber',
      type: 'string',
      required: false,
      description: 'Mobile number of lead contact',
      variables: true,
    },
  ],

  async run($) {
    const uid = await authenticate($);
    const id = await asyncMethodCall($, {
      method: 'execute_kw',
      params: [
        $.auth.data.databaseName,
        uid,
        $.auth.data.apiKey,
        'crm.lead',
        'create',
        [
          {
            name: $.step.parameters.name,
            type: $.step.parameters.type,
            email_from: $.step.parameters.email,
            contact_name: $.step.parameters.contactName,
            phone: $.step.parameters.phoneNumber,
            mobile: $.step.parameters.mobileNumber,
          },
        ],
      ],
      path: 'object',
    });

    $.setActionItem({
      raw: {
        id: id,
      },
    });
  },
});
