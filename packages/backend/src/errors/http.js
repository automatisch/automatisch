import BaseError from './base.js';

export default class HttpError extends BaseError {
  constructor(error) {
    const computedError = error.response?.data || error.message;
    super(computedError);

    this.response = error.response;
  }
}
