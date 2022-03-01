import appInfoType from '../../types/app-info';
import JSONObject from './json-object';

export default interface AuthenticationInterface {
  appData: appInfoType;
  connectionData: JSONObject;
  client: unknown;
  verifyCredentials(): Promise<JSONObject>;
  isStillVerified(): Promise<boolean>;
}
