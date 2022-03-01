import type { IApp } from '@automatisch/types';
import JSONObject from './json-object';

export default interface AuthenticationInterface {
  appData: IApp;
  connectionData: IJSONObject;
  client: unknown;
  verifyCredentials(): Promise<JSONObject>;
  isStillVerified(): Promise<boolean>;
}
