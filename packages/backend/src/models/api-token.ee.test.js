import { describe, it, expect, vi } from 'vitest';
import ApiToken from './api-token.ee.js';

describe('ApiToken model', () => {
  it('tableName should return correct name', () => {
    expect(ApiToken.tableName).toBe('api_tokens');
  });

  it('jsonSchema should have correct validations', () => {
    expect(ApiToken.jsonSchema).toMatchSnapshot();
  });

  describe('assignToken', () => {
    it('should assign a new token', async () => {
      const apiToken = new ApiToken();
      await apiToken.assignToken();

      expect(apiToken.token).toBeDefined();
    });
  });

  describe('beforeInsert', () => {
    it('should call assignToken method', async () => {
      const apiToken = new ApiToken();
      const assignTokenSpy = vi.spyOn(apiToken, 'assignToken');

      await apiToken.$beforeInsert();
      expect(assignTokenSpy).toHaveBeenCalled();
    });
  });
});
