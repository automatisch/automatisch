export default {
  name: 'List DocTypes',
  key: 'listDoctypes',

  async run($) {
    const doctypes = {
      data: [],
    };

    const params = {
      order_by: 'name',
      limit_start: 0,
      limit: 1000,
      last_fetched_count: 0,
    };

    do {
      const { data: response } = await $.http.get(
        '/v2/document/DocType', // DocType is also a DocType!
        { params }
      );

      const { data: doctypeList } = response;
      const transformedDoctypes = doctypeList.map((doctype) => ({
        name: doctype.name,
        value: doctype.name,
      }));
      doctypes.data.push(...transformedDoctypes);

      const fetchedCount = doctypeList.length;
      params.limit_start += fetchedCount;
      params.last_fetched_count = fetchedCount;
    } while (params.last_fetched_count === params.limit);

    return doctypes;
  },
};
