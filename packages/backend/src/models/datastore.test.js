import { describe, it, expect } from 'vitest';
import Datastore from './datastore';

describe('Datastore model', () => {
  it('tableName should return correct name', () => {
    expect(Datastore.tableName).toBe('datastore');
  });

  it('jsonSchema should have the correct schema', () => {
    const expectedSchema = {
      type: 'object',
      required: ['key', 'value', 'scope', 'scopeId'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        key: { type: 'string', minLength: 1 },
        value: { type: 'string' },
        scope: {
          type: 'string',
          enum: ['flow'],
          default: 'flow',
        },
        scopeId: { type: 'string', format: 'uuid' },
      },
    };

    expect(Datastore.jsonSchema).toStrictEqual(expectedSchema);
  });
});
