import defineAction from '../../../../helpers/define-action.js';
import isEmpty from 'lodash/isEmpty.js';
import omitBy from 'lodash/omitBy.js';

export default defineAction({
  name: 'Create user',
  key: 'createUser',
  description: 'Creates a new user.',
  arguments: [
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Username',
      key: 'username',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Password',
      key: 'password',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'First Name',
      key: 'firstName',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Last Name',
      key: 'lastName',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Display Name',
      key: 'displayName',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Nickname',
      key: 'nickname',
      type: 'string',
      required: false,
      description: '',
      variables: true,
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
      label: 'Website',
      key: 'website',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Role',
      key: 'role',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Administrator', value: 'administrator' },
        { label: 'Author', value: 'author' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Editor', value: 'editor' },
        { label: 'Subscriber', value: 'subscriber' },
      ],
    },
  ],

  async run($) {
    const {
      email,
      username,
      password,
      firstName,
      lastName,
      displayName,
      nickname,
      description,
      website,
      role,
    } = $.step.parameters;

    let body = {
      email,
      username,
      password,
      first_name: firstName,
      last_name: lastName,
      name: displayName,
      nickname,
      description,
      url: website,
    };

    if (role) {
      body.roles = [role];
    }

    body = omitBy(body, isEmpty);

    const response = await $.http.post('?rest_route=/wp/v2/users', body);

    $.setActionItem({ raw: response.data });
  },
});
