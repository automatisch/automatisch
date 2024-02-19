import serializers from '../serializers/index.js';

const isPaginated = (object) =>
  object?.pageInfo &&
  object?.totalCount !== undefined &&
  Array.isArray(object?.records);

const isArray = (object) =>
  Array.isArray(object) || Array.isArray(object?.records);

const totalCount = (object) =>
  isPaginated(object) ? object.totalCount : isArray(object) ? object.length : 1;

const renderObject = (response, object) => {
  let data = isPaginated(object) ? object.records : object;
  const type = isPaginated(object)
    ? object.records[0].constructor.name
    : Array.isArray(object)
    ? object[0].constructor.name
    : object.constructor.name;

  const serializer = serializers[type];

  if (serializer) {
    data = Array.isArray(data)
      ? data.map((item) => serializer(item))
      : serializer(data);
  }

  const computedPayload = {
    data,
    meta: {
      type,
      count: totalCount(object),
      isArray: isArray(object),
      currentPage: isPaginated(object) ? object.pageInfo.currentPage : null,
      totalPages: isPaginated(object) ? object.pageInfo.totalPages : null,
    },
  };

  return response.json(computedPayload);
};

export { renderObject };
