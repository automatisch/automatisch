import { describe, it, expect } from 'vitest';
import nock from 'nock';
import listSenderProfiles from './index.js';
import { createGlobalVariable } from '@/factories/global-variable.js';
import {
  envelope,
  errorEnvelope,
  pagination,
  senderProfile,
  SENT_API_URL,
  TEST_API_KEY,
} from '@/mocks/apps/sent/index.js';

const build = () =>
  createGlobalVariable({
    appKey: 'sent',
    formattedData: { apiKey: TEST_API_KEY, screenName: 'Sent' },
  });

describe('Sent list sender profiles dynamic data', () => {
  it('returns readable labels with stable UUID values', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/sender-profiles')
      .query({ page: 1, page_size: 100 })
      .reply(
        200,
        envelope({
          sender_profiles: [
            senderProfile,
            { ...senderProfile, id: 'b', name: 'Support', short_name: null },
          ],
          pagination: pagination(1, 100, 2),
        })
      );

    const result = await listSenderProfiles.run($);

    expect(result.data).toEqual([
      { value: senderProfile.id, name: 'Marketing Team (MKT)' },
      { value: 'b', name: 'Support' },
    ]);
  });

  it('follows pagination until has_more is false', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/sender-profiles')
      .query({ page: 1, page_size: 100 })
      .reply(
        200,
        envelope({
          sender_profiles: [senderProfile],
          pagination: pagination(1, 100, 101),
        })
      )
      .get('/v3/sender-profiles')
      .query({ page: 2, page_size: 100 })
      .reply(
        200,
        envelope({
          sender_profiles: [{ ...senderProfile, id: 'p2' }],
          pagination: pagination(2, 100, 101),
        })
      );

    const result = await listSenderProfiles.run($);

    expect(result.data.map((item) => item.value)).toEqual([
      senderProfile.id,
      'p2',
    ]);
  });

  it('returns an empty list for accounts without profiles', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/sender-profiles')
      .query(true)
      .reply(
        200,
        envelope({ sender_profiles: [], pagination: pagination(1, 100, 0) })
      );

    expect(await listSenderProfiles.run($)).toEqual({ data: [] });
  });

  it('treats a permission error as "no profiles"', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/sender-profiles')
      .query(true)
      .reply(403, errorEnvelope('AUTH_004', 'Access denied'));

    expect(await listSenderProfiles.run($)).toEqual({ data: [] });
  });

  it('surfaces an invalid credential', async () => {
    const { $ } = await build();

    nock(SENT_API_URL)
      .get('/v3/sender-profiles')
      .query(true)
      .reply(401, errorEnvelope('AUTH_002', 'Invalid or missing API key'));

    await expect(listSenderProfiles.run($)).rejects.toThrow();
  });
});
