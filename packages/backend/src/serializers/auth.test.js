import { describe, it, expect } from 'vitest';
import App from '../models/app';
import authSerializer from './auth';

describe('authSerializer', () => {
  it('should return auth data', async () => {
    const auth = await App.findAuthByKey('deepl');

    const expectedPayload = {
      fields: auth.fields,
      authenticationSteps: auth.authenticationSteps,
      reconnectionSteps: auth.reconnectionSteps,
      sharedAuthenticationSteps: auth.sharedAuthenticationSteps,
      sharedReconnectionSteps: auth.sharedReconnectionSteps,
    };

    expect(authSerializer(auth)).toStrictEqual(expectedPayload);
  });
});
