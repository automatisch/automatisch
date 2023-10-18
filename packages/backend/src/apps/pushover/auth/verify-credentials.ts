import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.post(`/1/messages.json`, {
    token: $.auth.data.apiToken as string,
    user: $.auth.data.userKey as string,
    message: 'hello world',
  });

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
