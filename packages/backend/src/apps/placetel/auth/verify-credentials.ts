import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const { data } = await $.http.get('/v2/me');

  await $.auth.set({
    screenName: `${data.name} @ ${data.company}`,
  });
};

export default verifyCredentials;
