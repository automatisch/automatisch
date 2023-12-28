import BaseError from './base';

export default class QuotaExceededError extends BaseError {
  constructor(error = 'The allowed task quota has been exhausted!') {
    super(error);

    this.statusCode = 422;
  }
}
