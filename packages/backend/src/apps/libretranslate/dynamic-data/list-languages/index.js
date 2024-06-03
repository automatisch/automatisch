export default {
  name: 'List languages',
  key: 'listLanguages',

  async run($) {
    const languages = {
      data: [],
    };

    const { data } = await $.http.get('/languages');

    if (!data?.length) {
      return;
    }

    for (const language of data) {
      languages.data.push({
        value: language.code,
        name: language.name,
      });
    }

    return languages;
  },
};
