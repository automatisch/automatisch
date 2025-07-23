export default {
  name: 'List languages',
  key: 'listLanguages',

  async run($) {
    const languages = {
      data: [
        {
          value: 'auto',
          name: 'Auto-detect',
        },
      ],
    };

    const { data } = await $.http.get('/languages');

    if (!data?.length) {
      return languages;
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
