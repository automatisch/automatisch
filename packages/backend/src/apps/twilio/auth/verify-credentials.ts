import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    await $.http.get('/2010-04-01/Accounts.json?PageSize=1', {
      auth: {
        username: $.auth.data.accountSid as string,
        password: $.auth.data.authToken as string,
      },
    });

    await $.auth.set({
      screenName: $.auth.data.accountSid,
    });
  } catch (error) {
    throw new Error(JSON.stringify(error.response.data));
  }
};

export default verifyCredentials;
