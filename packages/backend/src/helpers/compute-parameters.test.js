import { beforeEach, describe, it, expect } from 'vitest';
import { createExecutionStep } from '../../test/factories/execution-step.js';
import computeParameters from './compute-parameters.js';

const computeVariable = (stepId, path) => `{{step.${stepId}.${path}}}`;

describe('Compute parameters helper', () => {
  let executionStepOne,
    executionStepTwo,
    executionStepThree,
    executionSteps;

  beforeEach(async () => {
    executionStepOne = await createExecutionStep({
      dataOut: {
        step1Key1: 'plain text value for step1Key1',
        // eslint-disable-next-line no-loss-of-precision
        step1Key2: 1267963836502380617,
        step1Key3: '1267963836502380617',
        step1Key4: {
          step1Key4ChildKey1: 'plain text value for step1Key3ChildKey1',
          // eslint-disable-next-line no-loss-of-precision
          step1Key4ChildKey2: 1267963836502380617,
          step1Key4ChildKey3: '3650238061712679638',
          step1Key4ChildKey4: ["value1", "value2"],
        }
      }
    });

    executionStepTwo = await createExecutionStep({
      dataOut: {
        step2Key1: 'plain text value for step2Key1',
        // eslint-disable-next-line no-loss-of-precision
        step2Key2: 6502380617126796383,
        step2Key3: '6502380617126796383',
        step2Key4: {
          step2Key4ChildKey1: 'plain text value for step2Key3ChildKey1',
          // eslint-disable-next-line no-loss-of-precision
          step2Key4ChildKey2: 6502380617126796383,
          step2Key4ChildKey3: '6502380617312679638',
          step2Key4ChildKey4: ["value1", "value2"],
        }
      }
    });

    executionStepThree = await createExecutionStep({
      dataOut: {
        step3Key1: 'plain text value for step3Key1',
        // eslint-disable-next-line no-loss-of-precision
        step3Key2: 123123,
        step3Key3: '123123',
        step3Key4: {
          step3Key4ChildKey1: 'plain text value for step3Key3ChildKey1',
          // eslint-disable-next-line no-loss-of-precision
          step3Key4ChildKey2: 123123,
          step3Key4ChildKey3: '123123',
          step3Key4ChildKey4: ["value1", "value2"],
        }
      }
    });

    executionSteps = [executionStepOne, executionStepTwo, executionStepThree];
  });

  it('should resolve with parameters having no corresponding steps', () => {
    const parameters = {
      key1: `${computeVariable('non-existent-step-id', 'non-existent-key')}`,
      key2: `"${computeVariable('non-existent-step-id', 'non-existent-key')}" is the value for non-existent-key`,
    };

    const computedParameters = computeParameters(parameters, executionSteps);
    const expectedParameters = {
      key1: '',
      key2: '"" is the value for non-existent-key',
    }

    expect(computedParameters).toStrictEqual(expectedParameters);
  });

  describe('with no parameters', () => {
    it('should resolve empty object', () => {
      const parameters = {};

      const computedParameters = computeParameters(parameters, executionSteps);

      expect(computedParameters).toStrictEqual(parameters);
    });
  });

  describe('with string parameters', () => {
    it('should resolve as-is without variables', () => {
      const parameters = {
        key1: 'plain text',
        key2: 'plain text',
      };

      const computedParameters = computeParameters(parameters, executionSteps);

      expect(computedParameters).toStrictEqual(parameters);
    });

    it('should preserve leading and trailing spaces', () => {
      const parameters = {
        key1: '  plain text  ',
        key2: 'plain text  ',
        key3: '  plain text',
      };

      const computedParameters = computeParameters(parameters, executionSteps);

      expect(computedParameters).toStrictEqual(parameters);
    });

    it('should compute variables correctly', () => {
      const parameters = {
        key1: `static text  ${computeVariable(executionStepOne.stepId, 'step1Key1')}`,
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: `static text  plain text value for step1Key1`,
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });
  });

  describe('with number parameters', () => {
    it('should resolve number larger than MAX_SAFE_INTEGER correctly', () => {
      const parameters = {
        // eslint-disable-next-line no-loss-of-precision
        key1: 119007199254740999,
      };

      const computedParameters = computeParameters(parameters, executionSteps);

      expect(computedParameters).toStrictEqual(parameters);
      expect(computedParameters.key1 > Number.MAX_SAFE_INTEGER).toBe(true);
    });

    it('should resolve stringified number as-is', () => {
      const parameters = {
        key1: '119007199254740999',
      };

      const computedParameters = computeParameters(parameters, executionSteps);

      expect(computedParameters).toStrictEqual(parameters);
      expect(parseInt(parameters.key1))
    });

    it('should compute variables with int values correctly', () => {
      const parameters = {
        key1: `another static text ${computeVariable(executionStepThree.stepId, 'step3Key2')}`,
        key2: `${computeVariable(executionStepThree.stepId, 'step3Key3')}`
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: `another static text 123123`,
        key2: `123123`
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });

    it.todo('should compute variables with bigint values correctly', () => {
      const parameters = {
        key1: `another static text ${computeVariable(executionStepTwo.stepId, 'step2Key2')}`,
        key2: `${computeVariable(executionStepTwo.stepId, 'step2Key3')}`
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        // The expected `key2` is computed wrongly.
        key1: `another static text 6502380617126796383`,
        key2: `6502380617126796383`
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });
  });

  describe('with JSON parameters', () => {
    it('should resolve text + JSON value as-is', () => {
      const parameters = {
        key1: 'prepended text {"key": "value"} ',
      };

      const computedParameters = computeParameters(parameters, executionSteps);

      expect(computedParameters).toStrictEqual(parameters);
    });

    it('should resolve stringified JSON parsed', () => {
      const parameters = {
        key1: '{"key1": "plain text", "key2": "119007199254740999"}',
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: {
          key1: 'plain text',
          key2: '119007199254740999',
        },
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });

    it('should handle arrays at root level', () => {
      const parameters = {
        key1: '["value1", "value2"]',
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: ['value1', 'value2'],
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });

    it('should handle arrays in nested level', () => {
      const parameters = {
        key1: '{"items": ["value1", "value2"]}',
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: {
          items: ['value1', 'value2'],
        }
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });

    it('should compute mix variables correctly', () => {
      const parameters = {
        key1: `another static text ${computeVariable(executionStepThree.stepId, 'step3Key4.step3Key4ChildKey4')}`,
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: `another static text ["value1","value2"]`,
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });

    it('should compute variables correctly', () => {
      const parameters = {
        key1: `${computeVariable(executionStepThree.stepId, 'step3Key4.step3Key4ChildKey4')}`,
      };

      const computedParameters = computeParameters(parameters, executionSteps);
      const expectedParameters = {
        key1: ["value1", "value2"],
      };

      expect(computedParameters).toStrictEqual(expectedParameters);
    });
  });
});
