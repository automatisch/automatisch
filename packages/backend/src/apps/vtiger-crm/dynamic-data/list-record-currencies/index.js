export default {
  name: 'List record currencies',
  key: 'listRecordCurrencies',

  async run($) {
    const recordCurrencies = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Currency;',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result?.length) {
      for (const recordCurrency of data.result) {
        recordCurrencies.data.push({
          value: recordCurrency.id,
          name: recordCurrency.currency_code,
        });
      }
    }

    return recordCurrencies;
  },
};
