import { IJSONObject } from '@automatisch/types';

export default class BaseError extends Error {
  details = {};
  statusCode?: number;

  constructor(error?: string | IJSONObject) {
    let computedError: Record<string, unknown>;
    try {
      computedError = JSON.parse(error as string);
    } catch {
      computedError = (typeof error === 'string' || Array.isArray(error)) ? { error } : error;
    }

    let computedMessage: string;
    try {
      // challenge to input to see if it is stringified JSON
      JSON.parse(error as string);
      computedMessage = error as string;
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
