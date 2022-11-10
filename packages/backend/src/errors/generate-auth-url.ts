import { IJSONObject } from '@automatisch/types';
import BaseError from './base';

export default class GenerateAuthUrlError extends BaseError {
  constructor(error: IJSONObject) {
    const computedError =
      ((error.response as IJSONObject)?.data as IJSONObject) ||
      (error.message as string);

    super(computedError);

    this.message = `Error occured while creating authorization URL!`;
  }
}
