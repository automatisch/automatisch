import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get('/customers?limit=1&page=1&');

  await $.auth.set({
    screenName: $.auth.data.screenName,
    apikey: $.auth.data.apikey,
  });
};

export default verifyCredentials;
