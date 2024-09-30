import { describe, it, expect } from 'vitest';
import Datastore from './datastore';

describe('Datastore model', () => {
  it('tableName should return correct name', () => {
    expect(Datastore.tableName).toBe('datastore');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Datastore.jsonSchema).toMatchSnapshot();
  });
});
