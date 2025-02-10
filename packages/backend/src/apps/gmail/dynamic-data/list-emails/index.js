import getCurrentUser from '../../common/get-current-user.js';

export default {
  name: 'List emails',
  key: 'listEmails',

  async run($) {
    const emails = {
      data: [],
    };

    const currentUser = await getCurrentUser($);

    for (const emailAddress of currentUser.emailAddresses) {
      emails.data.push({
        value: emailAddress.value,
        name: emailAddress.value,
      });
    }

    return emails;
  },
};
