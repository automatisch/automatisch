const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get(
    'https://login.mailchimp.com/oauth2/metadata',
    {
      headers: {
        Authorization: `OAuth ${$.auth.data.accessToken}`,
      },
      additionalProperties: {
        skipAddingAuthHeader: true,
        skipAddingBaseUrl: true,
      },
    }
  );

  return currentUser;
};

export default getCurrentUser;
