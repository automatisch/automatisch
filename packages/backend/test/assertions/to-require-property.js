import { ValidationError } from 'objection';

export const toRequireProperty = async (model, requiredProperty) => {
  try {
    await model.query().insert({});
  } catch (error) {
    if (
      error instanceof ValidationError &&
      error.message.includes(
        `${requiredProperty}: must have required property '${requiredProperty}'`
      )
    ) {
      return {
        pass: true,
        message: () =>
          `Expected ${requiredProperty} to be required, and it was.`,
      };
    } else {
      return {
        pass: false,
        message: () =>
          `Expected ${requiredProperty} to be required, but it was not found in the error message.`,
      };
    }
  }
  return {
    pass: false,
    message: () =>
      `Expected ${requiredProperty} to be required, but no ValidationError was thrown.`,
  };
};
