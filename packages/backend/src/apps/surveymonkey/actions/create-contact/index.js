import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create contact',
  key: 'createContact',
  description: 'Creates a new contact in your address book.',
  arguments: [
    {
      label: 'First Name',
      key: 'firstName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Last Name',
      key: 'lastName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Contact List',
      key: 'contactListId',
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
            value: 'listContactLists',
          },
        ],
      },
    },
  ],

  async run($) {
    const { firstName, lastName, email, contactListId } = $.step.parameters;
    let url = '/v3/contacts';

    if (contactListId) {
      url = `/v3/contact_lists/${contactListId}/contacts`;
    }

    const body = {
      first_name: firstName,
      last_name: lastName,
      email,
    };

    const { data } = await $.http.post(url, body);

    $.setActionItem({
      raw: data,
    });
  },
});
