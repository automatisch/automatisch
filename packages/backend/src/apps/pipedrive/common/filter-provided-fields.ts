import isObject from 'lodash/isObject';

export function filterProvidedFields(body: Record<string, unknown>) {
  return Object.keys(body).reduce<Record<string, unknown>>((result, key) => {
    const value = body[key];
    if (isObject(value)) {
      const filteredNestedObj = filterProvidedFields(
        value as Record<string, unknown>
      );
      if (Object.keys(filteredNestedObj).length > 0) {
        result[key] = filteredNestedObj;
      }
    } else if (body[key]) {
      result[key] = value;
    }
    return result;
  }, {});
}
