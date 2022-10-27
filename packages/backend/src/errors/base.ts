import { IJSONObject } from '@automatisch/types';

export default class BaseError extends Error {
  error = {};

  constructor(error?: string | IJSONObject) {
    super();

    try {
      this.error = JSON.parse(error as string);
    } catch {
      this.error = typeof error === 'string' ? { error } : error;
    }

    this.name = this.constructor.name;
  }
}
