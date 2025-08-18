import { URL } from 'node:url';
import { ValidationError } from 'objection';
import Base from '@/models/base.js';
import App from '@/models/app.js';
import Flow from '@/models/flow.js';
import Connection from '@/models/connection.js';
import ExecutionStep from '@/models/execution-step.js';
import Telemetry from '@/helpers/telemetry/index.js';
import appConfig from '@/config/app.js';
import globalVariable from '@/helpers/global-variable.js';
import computeParameters from '@/helpers/compute-parameters.js';
import testRun from '@/services/test-run.js';
import { generateIconUrl } from '@/helpers/generate-icon-url.js';

class Step extends Base {
  static tableName = 'steps';

  static jsonSchema = {
    type: 'object',
    required: ['type'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      flowId: { type: 'string', format: 'uuid' },
      key: { type: ['string', 'null'] },
      name: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      appKey: { type: ['string', 'null'], minLength: 1, maxLength: 255 },
      type: { type: 'string', enum: ['action', 'trigger'] },
      structuralType: {
        type: 'string',
        enum: ['single', 'paths', 'branch'],
        default: 'single',
      },
      parentStepId: { type: ['string', 'null'], format: 'uuid' },
      branchConditions: {
        type: ['array', 'null'],
        items: {
          type: 'object',
        },
      },
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
    parentStep: {
      relation: Base.BelongsToOneRelation,
      modelClass: Step,
      join: {
        from: 'steps.parent_step_id',
        to: 'steps.id',
      },
    },
    childrenSteps: {
      relation: Base.HasManyRelation,
      modelClass: Step,
      join: {
        from: 'steps.id',
        to: 'steps.parent_step_id',
      },
    },
    lastExecutionStep: {
      relation: Base.HasOneRelation,
      modelClass: ExecutionStep,
      join: {
        from: 'steps.id',
        to: 'execution_steps.step_id',
      },
      filter(builder) {
        builder.orderBy('created_at', 'desc').limit(1).first();
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
    if (!this.webhookPath) return null;

    return new URL(this.webhookPath, appConfig.webhookUrl).toString();
  }

  get iconUrl() {
    return generateIconUrl(this.appKey);
  }

  get isTrigger() {
    return this.type === 'trigger';
  }

  get isAction() {
    return this.type === 'action';
  }

  async computeWebhookPath() {
    if (this.type === 'action') return null;

    const triggerCommand = await this.getTriggerCommand();

    if (!triggerCommand) return null;

    const isWebhook = triggerCommand.type === 'webhook';

    if (!isWebhook) return null;

    if (this.parameters.workSynchronously) {
      return `/webhooks/flows/${this.flowId}/sync`;
    }

    if (triggerCommand.workSynchronously) {
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

  async getApp() {
    if (!this.appKey) return null;

    return await App.findOneByKey(this.appKey);
  }

  async testAndContinue() {
    await testRun({ stepId: this.id });

    const updatedStep = await this.$query()
      .withGraphFetched('lastExecutionStep')
      .patchAndFetch({ status: 'completed' });

    return updatedStep;
  }

  async continueWithoutTest() {
    const updatedStep = await this.$query()
      .withGraphFetched('lastExecutionStep')
      .patchAndFetch({ status: 'completed' });

    return updatedStep;
  }

  async getLastExecutionStep() {
    return await this.$relatedQuery('lastExecutionStep');
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
    let substeps;

    if (this.isTrigger) {
      substeps = (await this.getTriggerCommand()).substeps;
    } else {
      substeps = (await this.getActionCommand()).substeps;
    }

    const setupSubstep = substeps.find(
      (substep) => substep.key === 'chooseTrigger'
    );
    return setupSubstep.arguments;
  }

  async getSetupAndDynamicFields() {
    const setupFields = await this.getSetupFields();
    const setupAndDynamicFields = [];

    for (const setupField of setupFields) {
      setupAndDynamicFields.push(setupField);

      const additionalFields = setupField.additionalFields;
      if (additionalFields) {
        const keyArgument = additionalFields.arguments.find(
          (argument) => argument.name === 'key'
        );
        const dynamicFieldsKey = keyArgument.value;

        const dynamicFields = await this.createDynamicFields(
          dynamicFieldsKey,
          this.parameters
        );

        setupAndDynamicFields.push(...dynamicFields);
      }
    }

    return setupAndDynamicFields;
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

  async createDynamicData(dynamicDataKey, parameters, currentUser) {
    const connection = await this.$relatedQuery('connection');
    const flow = await this.$relatedQuery('flow');
    const app = await this.getApp();

    const $ = await globalVariable({
      connection,
      app,
      flow,
      step: this,
      currentUser,
    });

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

    const setupAndDynamicFields = await this.getSetupAndDynamicFields();

    const computedParameters = computeParameters(
      $.step.parameters,
      setupAndDynamicFields,
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

  async delete() {
    await this.$relatedQuery('executionSteps').delete();
    await this.$query().delete();

    const flow = await this.$relatedQuery('flow');

    const nextSteps = await flow
      .$relatedQuery('steps')
      .where('position', '>', this.position);

    await flow.updateStepPositionsFrom(this.position, nextSteps);
  }

  async updateFor(user, newStepData) {
    const {
      appKey = this.appKey,
      name,
      connectionId,
      key,
      parameters,
    } = newStepData;

    if (connectionId && appKey) {
      await user.readableConnections
        .findOne({
          id: connectionId,
          key: appKey,
        })
        .throwIfNotFound();
    }

    if (this.isTrigger && appKey && key) {
      await App.checkAppAndTrigger(appKey, key);
    }

    if (this.isAction && appKey && key) {
      await App.checkAppAndAction(appKey, key);
    }

    const updatedStep = await this.$query().patchAndFetch({
      key,
      name,
      appKey,
      connectionId: connectionId,
      parameters: parameters,
      status: 'incomplete',
    });

    await updatedStep.updateWebhookUrl();

    return updatedStep;
  }

  async validateParentStep() {
    if (!this.parentStepId) return true;

    const parentStep = await this.$relatedQuery('parentStep').throwIfNotFound();

    if (!['branch', 'paths'].includes(parentStep.structuralType)) {
      throw new ValidationError({
        data: {
          parentStepId: [
            {
              message:
                'Parent step must have structuralType of "branch" or "paths" to have children',
            },
          ],
        },
        type: 'invalidParentStepStructuralTypeError',
      });
    }
  }

  async validateBranchConditions() {
    if (this.structuralType !== 'branch') return true;

    if (!this.branchConditions || this.branchConditions.length === 0) {
      throw new ValidationError({
        data: {
          branchConditions: [
            {
              message:
                'Branch conditions are required and must contain at least one condition!',
            },
          ],
        },
        type: 'invalidBranchConditionsError',
      });
    }
  }

  async assignStructuralType() {
    if (this.appKey === 'branches') {
      this.structuralType = 'paths';
    }
  }

  async insertInitialBranches() {
    if (this.structuralType === 'paths') {
      const childrenSteps = await this.$relatedQuery('childrenSteps');

      if (!childrenSteps.length) {
        await this.$relatedQuery('childrenSteps').insert({
          parentStepId: this.id,
          position: 1,
          flowId: this.flowId,
          structuralType: 'branch',
          type: 'action',
        });

        await this.$relatedQuery('childrenSteps').insert({
          parentStepId: this.id,
          position: 1,
          flowId: this.flowId,
          structuralType: 'branch',
          type: 'action',
        });
      }
    }
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);
    await this.validateParentStep();
    await this.assignStructuralType();
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);
    await this.validateParentStep();
    await this.validateBranchConditions();
    await this.assignStructuralType();
  }

  async $afterInsert(queryContext) {
    await super.$afterInsert(queryContext);
    await this.insertInitialBranches();
    Telemetry.stepCreated(this);
  }

  async $afterUpdate(opt, queryContext) {
    await super.$afterUpdate(opt, queryContext);
    await this.insertInitialBranches();
    Telemetry.stepUpdated(this);
  }
}

export default Step;
