import BaseError from './base';

export default class HttpError extends BaseError {
  constructor(error) {
    const computedError = error.response?.data || error.message;
    super(computedError);

    this.response = error.response;
  }
}
