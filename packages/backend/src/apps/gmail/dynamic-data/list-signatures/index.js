export default {
  name: 'List signatures',
  key: 'listSignatures',

  async run($) {
    const signatures = {
      data: [],
    };
    const userId = $.auth.data.userId;

    const { data } = await $.http.get(
      `/gmail/v1/users/${userId}/settings/sendAs`
    );

    for (const sendAs of data.sendAs) {
      signatures.data.push({
        value: sendAs.signature,
        name: sendAs.sendAsEmail,
      });
    }

    return signatures;
  },
};
