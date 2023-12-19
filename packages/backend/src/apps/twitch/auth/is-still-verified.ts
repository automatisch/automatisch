import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  const { data } = await $.http.get('https://id.twitch.tv/oauth2/validate');
  return !!data.login;
};

export default isStillVerified;
