import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get(
    `/reverse?access_key=${$.auth.data.apiKey}&query=50.94852,6.944772`
  );

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
