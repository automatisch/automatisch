export default {
  name: 'List contact lists',
  key: 'listContactLists',

  async run($) {
    const contactLists = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
    };

    let fetchedSum = 0;
    let total;
    do {
      const { data } = await $.http.get('/v3/contact_lists', { params });

      params.page = params.page + 1;
      fetchedSum = fetchedSum + params.per_page;
      total = data.total;

      if (data.data) {
        for (const contactList of data.data) {
          contactLists.data.push({
            value: contactList.id,
            name: contactList.name,
          });
        }
      }
    } while (fetchedSum <= total);

    return contactLists;
  },
};
