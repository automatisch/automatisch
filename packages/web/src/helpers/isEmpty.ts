import lodashIsEmpty from 'lodash/isEmpty';

export default function isEmpty(value: any) {
  if (value === undefined && value === null) return true;

  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  if (!Number.isNaN(value)) {
    return false;
  }

  // covers objects and anything else possibly
  return lodashIsEmpty(value);
};
