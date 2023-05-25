import get from 'lodash/get';
import set from 'lodash/set';
import forIn from 'lodash/forIn';
import isPlainObject from 'lodash/isPlainObject';

export default function filterObject(
  data: any,
  searchTerm: string,
  result = {},
  prefix: string[] = [],
  withinArray = false
) {
  if (withinArray) {
    const containerValue = get(result, prefix, []);

    result = filterObject(
      data,
      searchTerm,
      result,
      prefix.concat(containerValue.length.toString())
    );

    return result;
  }

  if (isPlainObject(data)) {
    forIn(data, (value, key) => {
      const fullKey = [...prefix, key];

      if (key.toLowerCase().includes(searchTerm)) {
        set(result, fullKey, value);
        return;
      }

      result = filterObject(value, searchTerm, result, fullKey);
    });
  }

  if (Array.isArray(data)) {
    forIn(data, (value) => {
      result = filterObject(value, searchTerm, result, prefix, true);
    });
  }

  if (
    ['string', 'number'].includes(typeof data) &&
    String(data).toLowerCase().includes(searchTerm)
  ) {
    set(result, prefix, data);
  }

  return result;
};
