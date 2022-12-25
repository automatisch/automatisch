import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const { data } = await $.http.get('/getMe');
  const { result: me } = data;

  await $.auth.set({
    screenName: me.first_name,
  });
};

export default verifyCredentials;
