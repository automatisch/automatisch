import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get('https://' + $.auth.data.spaceName + '.' + $.auth.data.spaceRegion + 'signalwire.com' + '/api/laml/2010-04-01/Accounts');

  await $.auth.set({
    screenName: $.auth.data.accountSid,
  });
};

export default verifyCredentials;
