import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get(
      `/v1/events`,
  );
  await $.auth.set({
    screenName: $.auth.data?.displayName,
  });
};

export default verifyCredentials;
