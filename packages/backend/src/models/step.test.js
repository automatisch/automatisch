import { describe, it, expect, vi } from 'vitest';
import Base from './base.js';
import Step from './step.js';
import Flow from './flow.js';
import Connection from './connection.js';
import ExecutionStep from './execution-step.js';

describe('Step model', () => {
  it('tableName should return correct name', () => {
    expect(Step.tableName).toBe('steps');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Step.jsonSchema).toMatchSnapshot();
  });

  it('virtualAttributes should return correct attributes', () => {
    const virtualAttributes = Step.virtualAttributes;

    const expectedAttributes = ['iconUrl', 'webhookUrl'];

    expect(virtualAttributes).toStrictEqual(expectedAttributes);
  });

  describe('relationMappings', () => {
    it('should return correct associations', () => {
      const relationMappings = Step.relationMappings();

      const expectedRelations = {
        flow: {
          relation: Base.BelongsToOneRelation,
          modelClass: Flow,
          join: {
            from: 'steps.flow_id',
            to: 'flows.id',
          },
        },
        connection: {
          relation: Base.HasOneRelation,
          modelClass: Connection,
          join: {
            from: 'steps.connection_id',
            to: 'connections.id',
          },
        },
        lastExecutionStep: {
          relation: Base.HasOneRelation,
          modelClass: ExecutionStep,
          join: {
            from: 'steps.id',
            to: 'execution_steps.step_id',
          },
          filter: expect.any(Function),
        },
        executionSteps: {
          relation: Base.HasManyRelation,
          modelClass: ExecutionStep,
          join: {
            from: 'steps.id',
            to: 'execution_steps.step_id',
          },
        },
      };

      expect(relationMappings).toStrictEqual(expectedRelations);
    });

    it('lastExecutionStep should return the trigger step', () => {
      const relations = Step.relationMappings();

      const firstSpy = vi.fn();

      const limitSpy = vi.fn().mockImplementation(() => ({
        first: firstSpy,
      }));

      const orderBySpy = vi.fn().mockImplementation(() => ({
        limit: limitSpy,
      }));

      relations.lastExecutionStep.filter({ orderBy: orderBySpy });

      expect(orderBySpy).toHaveBeenCalledWith('created_at', 'desc');
      expect(limitSpy).toHaveBeenCalledWith(1);
      expect(firstSpy).toHaveBeenCalledOnce();
    });
  });
});
