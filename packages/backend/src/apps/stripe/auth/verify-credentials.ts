import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    await $.http.get(
        `/v1/events`,
    );
  } catch (e) {
    throw new Error('Invalid secret key')
  }
  await $.auth.set({
    screenName: $.auth.data?.displayName,
  });
};

export default verifyCredentials;
