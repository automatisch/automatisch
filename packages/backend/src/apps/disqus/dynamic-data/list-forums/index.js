export default {
  name: 'List forums',
  key: 'listForums',

  async run($) {
    const forums = {
      data: [],
    };

    const params = {
      limit: 100,
      order: 'desc',
      cursor: undefined,
    };

    let more;
    do {
      const { data } = await $.http.get('/3.0/users/listForums.json', {
        params,
      });
      params.cursor = data.cursor.next;
      more = data.cursor.hasNext;

      if (data.response?.length) {
        for (const forum of data.response) {
          forums.data.push({
            value: forum.id,
            name: forum.id,
          });
        }
      }
    } while (more);

    return forums;
  },
};
