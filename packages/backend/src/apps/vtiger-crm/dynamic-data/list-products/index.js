export default {
  name: 'List products',
  key: 'listProducts',

  async run($) {
    const products = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Products ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result?.length) {
      for (const product of data.result) {
        products.data.push({
          value: product.id,
          name: product.productname,
        });
      }
    }

    return products;
  },
};
