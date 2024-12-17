// Helpers to extract errors received from the API

export const getGeneralErrorMessage = ({ error, fallbackMessage }) => {
  if (!error) {
    return;
  }

  const errors = error?.response?.data?.errors;
  const generalError = errors?.general;

  if (generalError && Array.isArray(generalError)) {
    return generalError.join(' ');
  }

  if (!errors) {
    return error?.message || fallbackMessage;
  }
};

export const getFieldErrorMessage = ({ fieldName, error }) => {
  const errors = error?.response?.data?.errors;
  const fieldErrors = errors?.[fieldName];

  if (fieldErrors && Array.isArray(fieldErrors)) {
    return fieldErrors.join(', ');
  }

  return '';
};
