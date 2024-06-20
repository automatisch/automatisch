import { URL } from 'node:url';
import get from 'lodash.get';
import Base from './base.js';
import App from './app.js';
import Flow from './flow.js';
import Connection from './connection.js';
import ExecutionStep from './execution-step.js';
import Telemetry from '../helpers/telemetry/index.js';
import appConfig from '../config/app.js';
import globalVariable from '../helpers/global-variable.js';
import computeParameters from '../helpers/compute-parameters.js';

class Step extends Base {
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
      webhookPath: { type: ['string', 'null'] },
      deletedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
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

  get webhookUrl() {
    return new URL(this.webhookPath, appConfig.webhookUrl).toString();
  }

  get iconUrl() {
    if (!this.appKey) return null;

    return `${appConfig.baseUrl}/apps/${this.appKey}/assets/favicon.svg`;
  }

  async computeWebhookPath() {
    if (this.type === 'action') return null;

    const triggerCommand = await this.getTriggerCommand();

    if (!triggerCommand) return null;

    const { useSingletonWebhook, singletonWebhookRefValueParameter, type } =
      triggerCommand;

    const isWebhook = type === 'webhook';

    if (!isWebhook) return null;

    if (singletonWebhookRefValueParameter) {
      const parameterValue = get(
        this.parameters,
        singletonWebhookRefValueParameter
      );
      return `/webhooks/connections/${this.connectionId}/${parameterValue}`;
    }

    if (useSingletonWebhook) {
      return `/webhooks/connections/${this.connectionId}`;
    }

    if (this.parameters.workSynchronously) {
      return `/webhooks/flows/${this.flowId}/sync`;
    }

    return `/webhooks/flows/${this.flowId}`;
  }

  async getWebhookUrl() {
    if (this.type === 'action') return;

    const path = await this.computeWebhookPath();
    const webhookUrl = new URL(path, appConfig.webhookUrl).toString();

    return webhookUrl;
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    Telemetry.stepCreated(this);
  }

  async $afterUpdate(opt, queryContext) {
    await super.$afterUpdate(opt, queryContext);
    Telemetry.stepUpdated(this);
  }

  get isTrigger() {
    return this.type === 'trigger';
  }

  get isAction() {
    return this.type === 'action';
  }

  async getApp() {
    if (!this.appKey) return null;

    return await App.findOneByKey(this.appKey);
  }

  async getLastExecutionStep() {
    const lastExecutionStep = await this.$relatedQuery('executionSteps')
      .orderBy('created_at', 'desc')
      .limit(1)
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
    const command = app.triggers?.find((trigger) => trigger.key === key);

    return command;
  }

  async getActionCommand() {
    const { appKey, key, isAction } = this;
    if (!isAction || !appKey || !key) return null;

    const app = await App.findOneByKey(appKey);
    const command = app.actions?.find((action) => action.key === key);

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

  async createDynamicFields(dynamicFieldsKey, parameters) {
    const connection = await this.$relatedQuery('connection');
    const flow = await this.$relatedQuery('flow');
    const app = await this.getApp();
    const $ = await globalVariable({ connection, app, flow, step: this });

    const command = app.dynamicFields.find(
      (data) => data.key === dynamicFieldsKey
    );

    for (const parameterKey in parameters) {
      const parameterValue = parameters[parameterKey];
      $.step.parameters[parameterKey] = parameterValue;
    }

    const dynamicFields = (await command.run($)) || [];

    return dynamicFields;
  }

  async createDynamicData(dynamicDataKey, parameters) {
    const connection = await this.$relatedQuery('connection');
    const flow = await this.$relatedQuery('flow');
    const app = await this.getApp();
    const $ = await globalVariable({ connection, app, flow, step: this });

    const command = app.dynamicData.find((data) => data.key === dynamicDataKey);

    for (const parameterKey in parameters) {
      const parameterValue = parameters[parameterKey];
      $.step.parameters[parameterKey] = parameterValue;
    }

    const lastExecution = await flow.$relatedQuery('lastExecution');
    const lastExecutionId = lastExecution?.id;

    const priorExecutionSteps = lastExecutionId
      ? await ExecutionStep.query().where({
          execution_id: lastExecutionId,
        })
      : [];

    const computedParameters = computeParameters(
      $.step.parameters,
      priorExecutionSteps
    );

    $.step.parameters = computedParameters;
    const dynamicData = (await command.run($)).data;

    return dynamicData;
  }

  async updateWebhookUrl() {
    if (this.isAction) return this;

    const payload = {
      webhookPath: await this.computeWebhookPath(),
    };

    await this.$query().patchAndFetch(payload);

    return this;
  }
}

export default Step;
