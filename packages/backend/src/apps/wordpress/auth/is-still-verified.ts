import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  await $.http.get('?rest_route=/wp/v2/settings');

  return true;
};

export default isStillVerified;
