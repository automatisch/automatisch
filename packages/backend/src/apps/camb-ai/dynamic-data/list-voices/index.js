export default {
  name: 'List voices',
  key: 'listVoices',

  async run($) {
    const { data } = await $.http.get('/apis/list-voices');

    const voices = {
      data: [],
    };

    if (Array.isArray(data)) {
      for (const voice of data) {
        voices.data.push({
          value: voice.id,
          name: voice.voice_name || voice.name || `Voice ${voice.id}`,
        });
      }
    }

    return voices;
  },
};
