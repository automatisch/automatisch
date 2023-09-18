import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get(
    `https://rest.nexmo.com/account/get-balance?api_key=${$.auth.data.apiKey}&api_secret=${$.auth.data.apiSecret}`
  );

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
