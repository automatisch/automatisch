import { vi, describe, it, expect } from 'vitest';
import Execution from './execution';
import ExecutionStep from './execution-step';
import Flow from './flow';
import Base from './base';
import Telemetry from '../helpers/telemetry/index';
import { createExecution } from '../../test/factories/execution';

describe('Execution model', () => {
  it('tableName should return correct name', () => {
    expect(Execution.tableName).toBe('executions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Execution.jsonSchema).toMatchSnapshot();
  });

  it('relationMappings should return correct associations', () => {
    const relationMappings = Execution.relationMappings();

    const expectedRelations = {
      executionSteps: {
        join: {
          from: 'executions.id',
          to: 'execution_steps.execution_id',
        },
        modelClass: ExecutionStep,
        relation: Base.HasManyRelation,
      },
      flow: {
        join: {
          from: 'executions.flow_id',
          to: 'flows.id',
        },
        modelClass: Flow,
        relation: Base.BelongsToOneRelation,
      },
    };

    expect(relationMappings).toStrictEqual(expectedRelations);
  });

  it('$afterInsert should call Telemetry.executionCreated', async () => {
    const telemetryExecutionCreatedSpy = vi
      .spyOn(Telemetry, 'executionCreated')
      .mockImplementation(() => {});

    const execution = await createExecution();

    expect(telemetryExecutionCreatedSpy).toHaveBeenCalledWith(execution);
  });
});
