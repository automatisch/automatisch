import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get('/2010-04-01/Accounts.json?PageSize=1');

  await $.auth.set({
    screenName: $.auth.data.accountSid,
  });
};

export default verifyCredentials;
