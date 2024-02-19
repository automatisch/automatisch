const getCurrentOrganization = async ($) => {
  const response = await $.http.get('/bigin/v2/org');
  return response.data.org[0];
};

export default getCurrentOrganization;
