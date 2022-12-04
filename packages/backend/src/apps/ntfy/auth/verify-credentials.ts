import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.post('/', { topic: 'automatisch' });
  let screenName = $.auth.data.serverUrl;

  if ($.auth.data.username) {
    screenName = `${$.auth.data.username} @ ${screenName}`
  }

  await $.auth.set({
    screenName,
  });
};

export default verifyCredentials;
