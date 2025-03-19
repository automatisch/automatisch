import { vi, describe, it, expect } from 'vitest';
import Execution from './execution';
import ExecutionStep from './execution-step';
import Step from './step';
import Base from './base';
import UsageData from './usage-data.ee';
import Telemetry from '../helpers/telemetry';
import appConfig from '../config/app';
import { createExecution } from '../../test/factories/execution';
import { createExecutionStep } from '../../test/factories/execution-step';

describe('ExecutionStep model', () => {
  it('tableName should return correct name', () => {
    expect(ExecutionStep.tableName).toBe('execution_steps');
  });

  it('jsonSchema should have correct validations', () => {
    expect(ExecutionStep.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = ExecutionStep.relationMappings();

    const expectedRelations = {
      execution: {
        relation: Base.BelongsToOneRelation,
        modelClass: Execution,
        join: {
          from: 'execution_steps.execution_id',
          to: 'executions.id',
        },
      },
      step: {
        relation: Base.BelongsToOneRelation,
        modelClass: Step,
        join: {
          from: 'execution_steps.step_id',
          to: 'steps.id',
        },
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  describe('isFailed', () => {
    it('should return true if status is failure', async () => {
      const executionStep = new ExecutionStep();
      executionStep.status = 'failure';

      expect(executionStep.isFailed).toBe(true);
    });

    it('should return false if status is not failure', async () => {
      const executionStep = new ExecutionStep();
      executionStep.status = 'success';

      expect(executionStep.isFailed).toBe(false);
    });
  });

  describe('isSucceededNonTestRun', () => {
    it('should return false if it has a test run execution', async () => {
      const execution = await createExecution({
        testRun: true,
      });

      const executionStep = await createExecutionStep({
        executionId: execution.id,
      });

      expect(await executionStep.isSucceededNonTestRun()).toBe(false);
    });

    it('should return false if it has a failure status', async () => {
      const executionStep = await createExecutionStep({
        status: 'failure',
      });

      expect(await executionStep.isSucceededNonTestRun()).toBe(false);
    });

    it('should return true if it has a succeeded non test run', async () => {
      const executionStep = await createExecutionStep({
        status: 'success',
      });

      expect(await executionStep.isSucceededNonTestRun()).toBe(true);
    });
  });

  describe('updateUsageData', () => {
    it('should call usageData.increaseConsumedTaskCountByOne', async () => {
      const executionStep = await createExecutionStep();

      const increaseConsumedTaskCountByOneSpy = vi.spyOn(
        UsageData.prototype,
        'increaseConsumedTaskCountByOne'
      );

      await executionStep.updateUsageData();

      expect(increaseConsumedTaskCountByOneSpy).toHaveBeenCalledOnce();
    });
  });

  describe('increaseUsageCount', () => {
    it('should call updateUsageData for cloud and succeeded non test run', async () => {
      vi.spyOn(appConfig, 'isCloud', 'get').mockReturnValue(true);
      vi.spyOn(
        ExecutionStep.prototype,
        'isSucceededNonTestRun'
      ).mockReturnValue(true);

      const executionStep = await createExecutionStep();

      const updateUsageDataSpy = vi.spyOn(
        ExecutionStep.prototype,
        'updateUsageData'
      );

      await executionStep.increaseUsageCount();

      expect(updateUsageDataSpy).toHaveBeenCalledOnce();
    });
  });

  describe('$afterInsert', () => {
    it('should call Telemetry.executionStepCreated', async () => {
      const telemetryExecutionStepCreatedSpy = vi
        .spyOn(Telemetry, 'executionStepCreated')
        .mockImplementation(() => {});

      const executionStep = await createExecutionStep();

      expect(telemetryExecutionStepCreatedSpy).toHaveBeenCalledWith(
        executionStep
      );
    });

    it('should call increaseUsageCount', async () => {
      const increaseUsageCountSpy = vi.spyOn(
        ExecutionStep.prototype,
        'increaseUsageCount'
      );

      await createExecutionStep();

      expect(increaseUsageCountSpy).toHaveBeenCalledOnce();
    });
  });

  describe('updateExecutionStatus', () => {
    it('should update execution status to failure when step status is failure', async () => {
      const execution = await createExecution();
      const executionStep = await createExecutionStep({
        executionId: execution.id,
        status: 'failure',
      });

      await executionStep.updateExecutionStatus();

      const updatedExecution = await execution.$query();
      expect(updatedExecution.status).toBe('failure');
    });

    it('should update execution status to success when step status is success', async () => {
      const execution = await createExecution();
      const executionStep = await createExecutionStep({
        executionId: execution.id,
        status: 'success',
      });

      await executionStep.updateExecutionStatus();

      const updatedExecution = await execution.$query();
      expect(updatedExecution.status).toBe('success');
    });
  });
});
