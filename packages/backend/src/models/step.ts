import { URL } from 'node:url';
import { QueryContext, ModelOptions } from 'objection';
import type { IJSONObject, IStep } from '@automatisch/types';
import Base from './base';
import App from './app';
import Flow from './flow';
import Connection from './connection';
import ExecutionStep from './execution-step';
import Telemetry from '../helpers/telemetry';
import appConfig from '../config/app';

class Step extends Base {
  id!: string;
  flowId!: string;
  key?: string;
  appKey?: string;
  type!: IStep['type'];
  connectionId?: string;
  status: 'incomplete' | 'completed';
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
      status: {
        type: 'string',
        enum: ['incomplete', 'completed'],
        default: 'incomplete',
      },
      position: { type: 'integer' },
      parameters: { type: 'object' },
    },
  };

  static get virtualAttributes() {
    return ['iconUrl', 'webhookUrl'];
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

  get webhookUrl() {
    if (this.appKey !== 'webhook') return null;

    const url = new URL(`/webhooks/${this.flowId}`, appConfig.webhookUrl);
    return url.toString();
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

  get isAction(): boolean {
    return this.type === 'action';
  }

  async getApp() {
    if (!this.appKey) return null;

    return await App.findOneByKey(this.appKey);
  }

  async getLastExecutionStep() {
    const lastExecutionStep = await this.$relatedQuery('executionSteps')
      .orderBy('created_at', 'desc')
      .first();

    return lastExecutionStep;
  }

  async getNextStep() {
    const flow = await this.$relatedQuery('flow');

    return await flow
      .$relatedQuery('steps')
      .findOne({ position: this.position + 1 });
  }

  async getTriggerCommand() {
    const { appKey, key, isTrigger } = this;
    if (!isTrigger || !appKey || !key) return null;

    const app = await App.findOneByKey(appKey);
    const command = app.triggers.find((trigger) => trigger.key === key);

    return command;
  }

  async getActionCommand() {
    const { appKey, key, isAction } = this;
    if (!isAction || !appKey || !key) return null;

    const app = await App.findOneByKey(appKey);
    const command = app.actions.find((action) => action.key === key);

    return command;
  }

  async getSetupFields() {
    let setupSupsteps;

    if (this.isTrigger) {
      setupSupsteps = (await this.getTriggerCommand()).substeps;
    } else {
      setupSupsteps = (await this.getActionCommand()).substeps;
    }

    const existingArguments = setupSupsteps.find(
      (substep) => substep.key === 'chooseTrigger'
    ).arguments;

    return existingArguments;
  }
}

export default Step;
