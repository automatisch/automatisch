export default {
  name: 'List companies',
  key: 'listCompanies',

  async run($) {
    const companies = {
      data: [],
    };

    const params = new URLSearchParams({
      page: 1,
      pageSize: 200,
      fields: 'Account_Name',
    });

    let next = false;
    do {
      const { data } = await $.http.get('/bigin/v2/Accounts', { params });

      if (data.info.more_records) {
        params.page = params.page + 1;
        next = true;
      } else {
        next = false;
      }

      if (data.data) {
        for (const account of data.data) {
          companies.data.push({
            value: account.id,
            name: account.Account_Name,
          });
        }
      }
    } while (next);

    return companies;
  },
};
