import serializers from '../serializers/index.js';

const isPaginated = (object) =>
  object?.pageInfo &&
  object?.totalCount !== undefined &&
  Array.isArray(object?.records);

const isArray = (object) =>
  Array.isArray(object) || Array.isArray(object?.records);

const totalCount = (object) =>
  isPaginated(object) ? object.totalCount : isArray(object) ? object.length : 1;

const renderObject = (response, object, options) => {
  if (object === null || object === undefined) {
    return response.status(200).json({
      data: null,
      meta: {
        type: 'Object',
        count: 0,
        isArray: false,
        currentPage: null,
        totalPages: null,
      },
    });
  }

  let data = isPaginated(object) ? object.records : object;

  const type = isPaginated(object)
    ? object.records[0]?.constructor?.name || 'Object'
    : Array.isArray(object)
    ? object?.[0]?.constructor?.name || 'Object'
    : object.constructor.name;

  const serializer = options?.serializer
    ? serializers[options.serializer]
    : serializers[type];

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

  const status = options?.status || 200;

  return response.status(status).json(computedPayload);
};

const renderError = (response, errors, status, type) => {
  const errorStatus = status || 422;
  const errorType = type || 'ValidationError';

  const payload = {
    errors: errors.reduce((acc, error) => {
      const key = Object.keys(error)[0];
      acc[key] = error[key];
      return acc;
    }, {}),
    meta: {
      type: errorType,
    },
  };

  return response.status(errorStatus).send(payload);
};

const renderUniqueViolationError = (response, error) => {
  const errors = error.columns.map((column) => ({
    [column]: [`'${column}' must be unique.`],
  }));

  return renderError(response, errors, 422, 'UniqueViolationError');
};

const renderObjectionError = (response, error, status) => {
  const { statusCode, type, data = {} } = error;

  const computedStatusCode = status || statusCode;

  const computedErrors = Object.entries(data).map(
    ([fieldName, fieldErrors]) => ({
      [fieldName]: fieldErrors.map(({ message }) => message),
    })
  );

  return renderError(response, computedErrors, computedStatusCode, type);
};

export {
  renderObject,
  renderError,
  renderObjectionError,
  renderUniqueViolationError,
};
