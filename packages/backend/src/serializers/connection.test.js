import { describe, it, expect, beforeEach } from 'vitest';
import { createConnection } from '../../test/factories/connection';
import connectionSerializer from './connection';

describe('connectionSerializer', () => {
  let connection;

  beforeEach(async () => {
    connection = await createConnection();
  });

  it('should return connection data', async () => {
    const expectedPayload = {
      id: connection.id,
      key: connection.key,
      reconnectable: connection.reconnectable,
      appAuthClientId: connection.appAuthClientId,
      formattedData: {
        screenName: connection.formattedData.screenName,
      },
      verified: connection.verified,
      createdAt: connection.createdAt.getTime(),
      updatedAt: connection.updatedAt.getTime(),
    };

    expect(connectionSerializer(connection)).toEqual(expectedPayload);
  });
});
