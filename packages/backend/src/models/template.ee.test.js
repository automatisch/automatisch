import { describe, it, expect } from 'vitest';
import Template from './template.ee.js';

describe('Template model', () => {
  it('tableName should return correct name', () => {
    expect(Template.tableName).toBe('templates');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Template.jsonSchema).toMatchSnapshot();
  });
});
