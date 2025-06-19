import BaseError from '@/errors/base.js';

export default class GenerateAuthUrlError extends BaseError {
  constructor(error) {
    const computedError = error.response?.data || error.message;
    super(computedError);

    this.message = `Error occurred while creating authorization URL!`;
  }
}
