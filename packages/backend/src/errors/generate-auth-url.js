import BaseError from './base';

export default class GenerateAuthUrlError extends BaseError {
  constructor(error) {
    const computedError = error.response?.data || error.message;
    super(computedError);

    this.message = `Error occured while creating authorization URL!`;
  }
}
