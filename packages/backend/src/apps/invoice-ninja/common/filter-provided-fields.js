import isObject from 'lodash/isObject.js';

export function filterProvidedFields(body) {
  return Object.keys(body).reduce((result, key) => {
    const value = body[key];

    if (isObject(value)) {
      const filteredNestedObj = filterProvidedFields(value);
      if (Object.keys(filteredNestedObj).length > 0) {
        result[key] = filteredNestedObj;
      }
    } else if (body[key]) {
      result[key] = value;
    }

    return result;
  }, {});
}
