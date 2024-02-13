const isPaginated = (object) =>
  object?.pageInfo &&
  object?.totalCount !== undefined &&
  Array.isArray(object?.records);

const isArray = (object) =>
  Array.isArray(object) || Array.isArray(object?.records);

const totalCount = (object) =>
  isPaginated(object) ? object.totalCount : isArray(object) ? object.length : 1;

const renderObject = (response, object) => {
  const data = isPaginated(object) ? object.records : object;

  const computedPayload = {
    data,
    meta: {
      type: isPaginated(object)
        ? object.records[0].constructor.name
        : object.constructor.name,
      count: totalCount(object),
      isArray: isArray(object),
      currentPage: isPaginated(object) ? object.pageInfo.currentPage : null,
      totalPages: isPaginated(object) ? object.pageInfo.totalPages : null,
    },
  };

  return response.json(computedPayload);
};

export { renderObject };
