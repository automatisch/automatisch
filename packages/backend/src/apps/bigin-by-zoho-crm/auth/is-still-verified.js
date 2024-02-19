import getCurrentOrganization from '../common/get-current-organization.js';

const isStillVerified = async ($) => {
  const org = await getCurrentOrganization($);
  return !!org.id;
};

export default isStillVerified;
