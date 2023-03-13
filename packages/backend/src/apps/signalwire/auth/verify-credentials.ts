import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const { data } = await $.http.get(`/api/laml/2010-04-01/Accounts/${$.auth.data.accountSid}`);

  await $.auth.set({
    screenName: `${data.friendly_name} (${$.auth.data.accountSid})`,
  });
};

export default verifyCredentials;
