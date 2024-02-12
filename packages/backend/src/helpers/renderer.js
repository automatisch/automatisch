const renderObject = (response, object) => {
  const isArray = Array.isArray(object);

  const computedPayload = {
    data: object,
    meta: {
      type: object.constructor.name,
      count: isArray ? object.length : 1,
      isArray,
      currentPage: null,
      totalPages: null,
    },
  };

  return response.json(computedPayload);
};

export { renderObject };
