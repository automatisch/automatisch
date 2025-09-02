import globalVariable from '@/engine/global-variable.js';
import EarlyExitError from '@/errors/early-exit.js';
import AlreadyProcessedError from '@/errors/already-processed.js';
import HttpError from '@/errors/http.js';
import Execution from '@/models/execution.js';
import isEmpty from 'lodash/isEmpty.js';
import { logger } from '@/helpers/logger.js';

class DataLoader {
  constructor(flowContext) {
    this.flowContext = flowContext;
    this.flow = flowContext.flow;
    this.triggerStep = flowContext.triggerStep;
    this.triggerConnection = flowContext.triggerConnection;
    this.triggerApp = flowContext.triggerApp;
    this.triggerCommand = flowContext.triggerCommand;
    this.isTriggerBuiltInApp = flowContext.isTriggerBuiltInApp;
    this.testRun = flowContext.testRun;
  }

  async run({ request, triggeredByRequest }) {
    const { data, error } = await this.fetchInitialData({
      request,
      triggeredByRequest,
    });

    if (error) {
      return await this.handleInitialDataError({ error });
    }

    const preparedData = this.prepareDataForExecution({ data });

    if (this.shouldSkipExecution({ preparedData, triggeredByRequest })) {
      return { skip: true };
    }

    return {
      success: true,
      data: preparedData,
    };
  }

  async fetchInitialData({ request, triggeredByRequest }) {
    this.$ = await this.createGlobalVariable({
      request,
    });

    await this.executeTriggerWithErrorHandling({
      triggeredByRequest,
    });

    return this.extractTriggerOutput();
  }

  async createGlobalVariable({ request }) {
    return await globalVariable({
      flow: this.flow,
      connection: this.triggerConnection,
      app: this.triggerApp,
      step: this.triggerStep,
      testRun: this.testRun,
      request,
    });
  }

  async executeTriggerWithErrorHandling({ triggeredByRequest }) {
    try {
      await this.executeTrigger({ triggeredByRequest });
    } catch (error) {
      await this.handleTriggerError({ error });
    }
  }

  async executeTrigger({ triggeredByRequest }) {
    const executionType = this.determineTriggerExecutionType({
      triggeredByRequest,
    });

    await this.runTriggerByType({ executionType });
  }

  determineTriggerExecutionType({ triggeredByRequest }) {
    if (triggeredByRequest && this.isTriggerBuiltInApp) {
      return 'built-in-request';
    }

    if (this.testRun && this.triggerCommand.type === 'webhook') {
      return 'webhook-test';
    }

    return 'standard';
  }

  async runTriggerByType({ executionType }) {
    switch (executionType) {
      case 'built-in-request':
      case 'standard':
        await this.triggerCommand.run(this.$);
        break;
      case 'webhook-test':
        await this.triggerCommand.testRun(this.$);
        break;
      default:
        throw new Error(`Unknown execution type: ${executionType}`);
    }
  }

  async handleTriggerError({ error }) {
    if (this.isSpecialError(error)) {
      return;
    }

    this.$.triggerOutput.error = this.formatErrorOutput(error);

    logger.error(error);
  }

  isSpecialError(error) {
    return (
      error instanceof EarlyExitError || error instanceof AlreadyProcessedError
    );
  }

  formatErrorOutput(error) {
    if (error instanceof HttpError) return error.details;
    return this.parseErrorMessage(error.message);
  }

  parseErrorMessage(message) {
    try {
      return JSON.parse(message);
    } catch {
      return { error: message };
    }
  }

  extractTriggerOutput() {
    return {
      data: this.$.triggerOutput.data,
      error: this.$.triggerOutput.error,
    };
  }

  async handleInitialDataError({ error }) {
    const execution = await this.createFailedExecution();
    const executionStep = await this.createFailedExecutionStep({
      execution,
      error,
    });

    return {
      error: true,
      executionStep,
      executionId: execution.id,
      flowId: this.flow.id,
      stepId: this.triggerStep.id,
    };
  }

  async createFailedExecution() {
    return await Execution.query().insert({
      flowId: this.flow.id,
      testRun: this.testRun,
    });
  }

  async createFailedExecutionStep({ execution, error }) {
    return await execution.$relatedQuery('executionSteps').insertAndFetch({
      stepId: this.triggerStep.id,
      status: 'failure',
      dataIn: this.$.step.parameters,
      dataOut: null,
      errorDetails: error,
    });
  }

  prepareDataForExecution({ data }) {
    if (!data || isEmpty(data)) {
      return [];
    }

    if (this.testRun) {
      return [data[0]];
    }

    return data.reverse();
  }

  shouldSkipExecution({ preparedData, triggeredByRequest }) {
    return (
      !this.isTriggerBuiltInApp && triggeredByRequest && isEmpty(preparedData)
    );
  }
}

export default DataLoader;
