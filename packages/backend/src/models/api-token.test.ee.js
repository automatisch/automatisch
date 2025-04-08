import { describe, it, expect } from 'vitest';
import ApiToken from './api-token.js';

describe('ApiToken model', () => {
  it('tableName should return correct name', () => {
    expect(ApiToken.tableName).toBe('api_tokens');
  });

  it('jsonSchema should have correct validations', () => {
    expect(ApiToken.jsonSchema).toMatchSnapshot();
  });
});
