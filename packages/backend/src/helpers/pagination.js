const paginate = async (query, limit, offset) => {
  if (limit < 1 || limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  const [records, count] = await Promise.all([
    query.limit(limit).offset(offset),
    query.resultSize(),
  ]);

  return {
    pageInfo: {
      currentPage: Math.ceil(offset / limit + 1),
      totalPages: Math.ceil(count / limit),
    },
    totalCount: count,
    edges: records.map((record) => ({
      node: record,
    })),
  };
};

export default paginate;
