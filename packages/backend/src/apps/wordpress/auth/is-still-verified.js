const isStillVerified = async ($) => {
  await $.http.get('?rest_route=/wp/v2/settings');

  return true;
};

export default isStillVerified;
