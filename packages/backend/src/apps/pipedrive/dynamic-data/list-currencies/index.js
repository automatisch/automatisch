export default {
  name: 'List currencies',
  key: 'listCurrencies',

  async run($) {
    const currencies = {
      data: [],
    };

    const { data } = await $.http.get(
      `${$.auth.data.apiDomain}/api/v1/currencies`
    );

    if (data.data?.length) {
      for (const currency of data.data) {
        currencies.data.push({
          value: currency.code,
          name: currency.name,
        });
      }
    }

    return currencies;
  },
};
