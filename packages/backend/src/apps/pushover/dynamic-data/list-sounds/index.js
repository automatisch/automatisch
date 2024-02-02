export default {
  name: 'List sounds',
  key: 'listSounds',

  async run($) {
    const sounds = {
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
        name: value,
      });
    }

    return sounds;
  },
};
