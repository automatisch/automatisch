import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get(
      `/crm/v3/objects/contacts?limit=1`,
  );
  await $.auth.set({
    screenName: $.auth.data?.displayName,
  });
};

export default verifyCredentials;
