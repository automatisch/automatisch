import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get('/account');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apiKey: $.auth.data.apiKey,
  });
};

export default verifyCredentials;
