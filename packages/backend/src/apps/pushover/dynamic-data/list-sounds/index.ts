import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List sounds',
  key: 'listSounds',

  async run($: IGlobalVariable) {
    const sounds: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      token: $.auth.data.apiToken,
    };

    const { data } = await $.http.get(`/1/sounds.json`, { params });
    const soundEntries = Object.entries(data.sounds);

    for (const [key, value] of soundEntries) {
      sounds.data.push({
        value: key,
        name: value as string,
      });
    }

    return sounds;
  },
};
