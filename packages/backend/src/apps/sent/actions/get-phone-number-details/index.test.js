import { describe, it, expect } from 'vitest';
import nock from 'nock';
import getPhoneNumberDetails from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  envelope,
  errorEnvelope,
  phoneNumberDetails,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = (stepParameters) =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
    stepKey: 'getPhoneNumberDetails',
    stepParameters,
  });

describe('Sent get phone number details action', () => {
  it('looks up a valid international number', async () => {
    const { $ } = await build({ phoneNumber: '+14155550100' });

    nock(SENT_API_URL)
      .get('/v3/numbers/lookup/%2B14155550100')
      .reply(200, envelope(phoneNumberDetails));

    await getPhoneNumberDetails.run($);

    expect($.actionOutput.data.raw.data).toEqual(phoneNumberDetails);
    expect($.actionOutput.data.raw.data.line_type).toBe('mobile');
  });

  it('rejects invalid input without calling Sent', async () => {
    const { $ } = await build({ phoneNumber: '415-555-0100' });
    const scope = nock(SENT_API_URL).get(/.*/).reply(200, {});

    await expect(getPhoneNumberDetails.run($)).rejects.toThrow('E.164');
    expect(scope.isDone()).toBe(false);
  });

  it('surfaces a Sent error', async () => {
    const { $ } = await build({ phoneNumber: '+14155550100' });

    nock(SENT_API_URL)
      .get('/v3/numbers/lookup/%2B14155550100')
      .reply(
        404,
        errorEnvelope('RESOURCE_013', 'Phone number not found or invalid')
      );

    const error = await getPhoneNumberDetails.run($).catch((e) => e);

    expect(error.response.status).toBe(404);
  });
});
