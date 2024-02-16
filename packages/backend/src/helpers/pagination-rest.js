const paginateRest = async (query, page) => {
  const pageSize = 10;

  page = parseInt(page, 10);

  if (isNaN(page) || page < 1) {
    page = 1;
  }

  const [records, count] = await Promise.all([
    query.limit(pageSize).offset((page - 1) * pageSize),
    query.resultSize(),
  ]);

  return {
    pageInfo: {
      currentPage: page,
      totalPages: Math.ceil(count / pageSize),
    },
    totalCount: count,
    records,
  };
};

export default paginateRest;
