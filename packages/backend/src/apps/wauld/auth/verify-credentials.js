const verifyCredentials = async ($) => {
  const { data } = await $.http.post('/wauld.AccountService/GetAccount', {
    id: $.auth.data.accountId,
  });

  await $.auth.set({
    screenName: data.organizationName || $.auth.data.accountId,
  });
};

export default verifyCredentials;