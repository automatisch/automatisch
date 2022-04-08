import type { IApp, IJSONObject } from '@automatisch/types';

export default interface AuthenticationInterface {
  appData: IApp;
  connectionData: IJSONObject;
  client: unknown;
  verifyCredentials(): Promise<IJSONObject>;
  isStillVerified(): Promise<boolean>;
}
