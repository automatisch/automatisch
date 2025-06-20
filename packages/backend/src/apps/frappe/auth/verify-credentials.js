const verifyCredentials = async ($) => {
    const siteUrl = $.auth.data.site_url;
    const response = await $.http.get(`${siteUrl}/api/method/frappe.auth.get_logged_user`, {
      headers: {
        Authorization: `token ${$.auth.data.api_key}:${$.auth.data.api_secret}`,
      },
    });

    const username = response.data.message;
    await $.auth.set({
      screenName: `${username} @ ${$.auth.data.site_url}`,
    });
  
};

export default verifyCredentials;