import { DateTime } from 'luxon';
import Base from './base.js';
import Flow from './flow.js';
import ExecutionStep from './execution-step.js';
import Telemetry from '../helpers/telemetry/index.js';

class Execution extends Base {
  static tableName = 'executions';

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'string', format: 'uuid' },
      flowId: { type: 'string', format: 'uuid' },
      testRun: { type: 'boolean', default: false },
      internalId: { type: 'string' },
      status: { type: 'string', enum: ['success', 'failure'] },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    flow: {
      relation: Base.BelongsToOneRelation,
      modelClass: Flow,
      join: {
        from: 'executions.flow_id',
        to: 'flows.id',
      },
    },
    executionSteps: {
      relation: Base.HasManyRelation,
      modelClass: ExecutionStep,
      join: {
        from: 'executions.id',
        to: 'execution_steps.execution_id',
      },
    },
  });

  static find({ name, status, startDateTime, endDateTime }) {
    return this.query()
      .withSoftDeleted()
      .joinRelated({
        flow: true,
      })
      .withGraphFetched({
        flow: {
          steps: true,
        },
      })
      .where((builder) => {
        builder.withSoftDeleted();

        if (name) {
          builder.where('flow.name', 'ilike', `%${name}%`);
        }

        if (status === 'success') {
          builder.where('executions.status', 'success');
        } else if (status === 'failure') {
          builder.where('executions.status', 'failure');
        }

        if (startDateTime) {
          const startDate = DateTime.fromMillis(Number(startDateTime));

          if (startDate.isValid) {
            builder.where('executions.created_at', '>=', startDate.toISO());
          }
        }

        if (endDateTime) {
          const endDate = DateTime.fromMillis(Number(endDateTime));

          if (endDate.isValid) {
            builder.where('executions.created_at', '<=', endDate.toISO());
          }
        }
      })
      .orderBy('created_at', 'desc');
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.executionCreated(this);
  }
}

export default Execution;
