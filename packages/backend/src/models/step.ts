import { QueryContext, ModelOptions } from 'objection';
import Base from './base';
import App from './app';
import Flow from './flow';
import Connection from './connection';
import ExecutionStep from './execution-step';
import type { IJSONObject, IStep } from '@automatisch/types';
import Telemetry from '../helpers/telemetry';
import appConfig from '../config/app';

class Step extends Base {
  id!: string;
  flowId!: string;
  key?: string;
  appKey?: string;
  type!: IStep['type'];
  connectionId?: string;
  status = 'incomplete';
  position!: number;
  parameters: IJSONObject;
  connection?: Connection;
  flow: Flow;
  executionSteps: ExecutionStep[];

  static tableName = 'steps';

  static jsonSchema = {
    type: 'object',
    required: ['type'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      flowId: { type: 'string', format: 'uuid' },
      key: { type: ['string', 'null'] },
      appKey: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      type: { type: 'string', enum: ['action', 'trigger'] },
      connectionId: { type: ['string', 'null'], format: 'uuid' },
      status: { type: 'string', enum: ['incomplete', 'completed'] },
      position: { type: 'integer' },
      parameters: { type: 'object' },
    },
  };

  static get virtualAttributes() {
    return ['iconUrl'];
  }

  static relationMappings = () => ({
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
    executionSteps: {
      relation: Base.HasManyRelation,
      modelClass: ExecutionStep,
      join: {
        from: 'steps.id',
        to: 'execution_steps.step_id',
      },
    },
  });

  get iconUrl() {
    if (!this.appKey) return null;

    return `${appConfig.baseUrl}/apps/${this.appKey}/assets/favicon.svg`;
  }

  async $afterInsert(queryContext: QueryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.stepCreated(this);
  }

  async $afterUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.stepUpdated(this);
  }

  get isTrigger(): boolean {
    return this.type === 'trigger';
  }

  async getTrigger() {
    if (!this.isTrigger) return null;

    const { appKey, key } = this;

    const connection = await this.$relatedQuery('connection');
    const flow = await this.$relatedQuery('flow');

    const AppClass = (await import(`../apps/${appKey}`)).default;
    const appInstance = new AppClass(connection, flow, this);
    const command = appInstance.triggers[key];

    return command;
  }
}

export default Step;
