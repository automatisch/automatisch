const getCurrentUser = async ($) => {
    const siteUrl = $.auth.data.site_url;
    const response = await $.http.get(`${siteUrl}/api/method/frappe.integrations.oauth2.openid_profile`);
    const currentUser = response.data;

    return currentUser;
};

export default getCurrentUser;
