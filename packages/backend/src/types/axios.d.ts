import { IJSONObject } from '@automatisch/types';

declare module 'axios' {
  interface AxiosResponse {
    integrationError?: IJSONObject;
  }
}
