import { describe, it, expect } from 'vitest';
import {
  collectTemplateParameters,
  getTemplateParameterKey,
} from './template-parameters.js';

describe('Sent template parameters', () => {
  it('builds prefixed step parameter keys', () => {
    expect(getTemplateParameterKey('customerName')).toBe(
      'templateParameter_customerName'
    );
  });

  it('collects only filled template variables into a string map', () => {
    expect(
      collectTemplateParameters({
        templateId: 'x',
        templateParameter_customerName: 'Maria',
        templateParameter_orderNumber: 4321,
        templateParameter_empty: '',
        text: 'ignored',
      })
    ).toEqual({ customerName: 'Maria', orderNumber: '4321' });
    expect(collectTemplateParameters({})).toEqual({});
  });
});
