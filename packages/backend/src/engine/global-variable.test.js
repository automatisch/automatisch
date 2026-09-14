import { describe, it, expect, afterEach } from 'vitest';
import { Model } from 'objection';
import { client as knex } from '@/config/database.js';
import globalVariable from '@/engine/global-variable.js';
import Connection from '@/models/connection.js';
import { createConnection } from '@/factories/connection.js';

describe('globalVariable', () => {
  describe('$.auth.set', () => {
    it('shallow merges an object into the stored formatted data', async () => {
      const connection = await createConnection({
        formattedData: { screenName: 'Old', authenticationKey: 'key' },
      });
      const $ = await globalVariable({ connection });

      await $.auth.set({ screenName: 'New', extra: { nested: true } });

      expect($.auth.data).toEqual({
        screenName: 'New',
        authenticationKey: 'key',
        extra: { nested: true },
      });

      const persisted = await Connection.query().findById(connection.id);

      expect(persisted.formattedData).toEqual($.auth.data);
      expect(connection.formattedData).toEqual($.auth.data);
    });

    it('applies an updater function against the current stored data', async () => {
      const connection = await createConnection({
        formattedData: { screenName: 'Test', counters: { a: 1 } },
      });
      const $ = await globalVariable({ connection });

      // Change the stored data behind the back of the in-memory instance.
      await Connection.query()
        .findById(connection.id)
        .patch({
          formattedData: { screenName: 'Test', counters: { a: 1, b: 2 } },
        });

      await $.auth.set((currentData) => ({
        counters: { ...currentData.counters, c: 3 },
      }));

      const persisted = await Connection.query().findById(connection.id);

      expect(persisted.formattedData).toEqual({
        screenName: 'Test',
        counters: { a: 1, b: 2, c: 3 },
      });
      expect($.auth.data).toEqual(persisted.formattedData);
    });

    it('keeps the data encrypted at rest', async () => {
      const connection = await createConnection({
        formattedData: { screenName: 'Test' },
      });
      const $ = await globalVariable({ connection });

      await $.auth.set({ token: 'super-secret-token' });

      const row = await global
        .knex('connections')
        .where({ id: connection.id })
        .first();

      expect(row.data).not.toContain('super-secret-token');
    });

    it('returns null and does nothing without a connection', async () => {
      const $ = await globalVariable({});

      expect(await $.auth.set({ a: 1 })).toBeNull();
      expect($.auth.data).toBeUndefined();
    });

    describe('under concurrency', () => {
      const connectionIds = [];

      afterEach(async () => {
        Model.knex(knex);
        await knex('connections').whereIn('id', connectionIds).delete();
        Model.knex(global.knex);
      });

      it('does not lose concurrent updates from separate transactions', async () => {
        Model.knex(knex);

        const connection = await createConnection({
          formattedData: { screenName: 'Test' },
        });
        connectionIds.push(connection.id);

        const instances = await Promise.all(
          Array.from({ length: 5 }, () =>
            Connection.query().findById(connection.id)
          )
        );
        const $s = await Promise.all(
          instances.map((instance) => globalVariable({ connection: instance }))
        );

        await Promise.all(
          $s.map(($, index) =>
            $.auth.set((currentData) => ({
              secrets: { ...currentData.secrets, [`key-${index}`]: index },
            }))
          )
        );

        const persisted = await Connection.query().findById(connection.id);

        expect(persisted.formattedData).toEqual({
          screenName: 'Test',
          secrets: {
            'key-0': 0,
            'key-1': 1,
            'key-2': 2,
            'key-3': 3,
            'key-4': 4,
          },
        });
      });
    });
  });
});
