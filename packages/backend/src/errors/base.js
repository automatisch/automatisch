export default class BaseError extends Error {
  details = {};

  constructor(error) {
    let computedError;

    try {
      computedError = JSON.parse(error);
    } catch {
      computedError =
        typeof error === 'string' || Array.isArray(error) ? { error } : error;
    }

    let computedMessage;

    try {
      // challenge to input to see if it is stringified JSON
      JSON.parse(error);
      computedMessage = error;
    } catch {
      if (typeof error === 'string') {
        computedMessage = error;
      } else {
        computedMessage = JSON.stringify(error, null, 2);
      }
    }

    super(computedMessage);

    this.details = computedError;
    this.name = this.constructor.name;
  }
}
