import createHttpClient from './http-client';
import Connection from '../models/connection';
import Flow from '../models/flow';
import Step from '../models/step';
import Execution from '../models/execution';
import {
  IJSONObject,
  IApp,
  IGlobalVariable,
  ITriggerItem,
  IActionItem,
  IRequest,
} from '@automatisch/types';
import EarlyExitError from '../errors/early-exit';
import AlreadyProcessedError from '../errors/already-processed';

type GlobalVariableOptions = {
  connection?: Connection;
  app?: IApp;
  flow?: Flow;
  step?: Step;
  execution?: Execution;
  testRun?: boolean;
  request?: IRequest;
};

const globalVariable = async (
  options: GlobalVariableOptions
): Promise<IGlobalVariable> => {
  const {
    connection,
    app,
    flow,
    step,
    execution,
    request,
    testRun = false,
  } = options;

  const isTrigger = step?.isTrigger;
  const lastInternalId = testRun ? undefined : await flow?.lastInternalId();
  const nextStep = await step?.getNextStep();

  const $: IGlobalVariable = {
    auth: {
      set: async (args: IJSONObject) => {
        if (connection) {
          await connection.$query().patchAndFetch({
            formattedData: {
              ...connection.formattedData,
              ...args,
            },
          });

          $.auth.data = connection.formattedData;
        }

        return null;
      },
      data: connection?.formattedData,
    },
    app: app,
    flow: {
      id: flow?.id,
      lastInternalId,
    },
    step: {
      id: step?.id,
      appKey: step?.appKey,
      parameters: step?.parameters || {},
    },
    nextStep: {
      id: nextStep?.id,
      appKey: nextStep?.appKey,
      parameters: nextStep?.parameters || {},
    },
    execution: {
      id: execution?.id,
      testRun,
      exit: () => {
        throw new EarlyExitError();
      },
    },
    getLastExecutionStep: async () =>
      (await step?.getLastExecutionStep())?.toJSON(),
    triggerOutput: {
      data: [],
    },
    actionOutput: {
      data: {
        raw: null,
      },
    },
    pushTriggerItem: (triggerItem: ITriggerItem) => {
      if (
        isAlreadyProcessed(triggerItem.meta.internalId) &&
        !$.execution.testRun
      ) {
        // early exit as we do not want to process duplicate items in actual executions
        throw new AlreadyProcessedError();
      }

      $.triggerOutput.data.push(triggerItem);

      const isWebhookApp = app.key === 'webhook';

      if ($.execution.testRun && !isWebhookApp) {
        // early exit after receiving one item as it is enough for test execution
        throw new EarlyExitError();
      }
    },
    setActionItem: (actionItem: IActionItem) => {
      $.actionOutput.data = actionItem;
    },
  };

  if (request) {
    $.request = request;
  }

  if (app) {
    $.http = createHttpClient({
      $,
      baseURL: app.apiBaseUrl,
      beforeRequest: app.beforeRequest,
    });
  }

  if (step) {
    $.webhookUrl = await step.getWebhookUrl();
  }

  if (isTrigger) {
    const triggerCommand = await step.getTriggerCommand();

    if (triggerCommand.type === 'webhook') {
      $.flow.setRemoteWebhookId = async (remoteWebhookId) => {
        await flow.$query().patchAndFetch({
          remoteWebhookId,
        });

        $.flow.remoteWebhookId = remoteWebhookId;
      };

      $.flow.remoteWebhookId = flow.remoteWebhookId;
    }
  }

  const lastInternalIds =
    testRun || (flow && step?.isAction)
      ? []
      : await flow?.lastInternalIds(2000);

  const isAlreadyProcessed = (internalId: string) => {
    return lastInternalIds?.includes(internalId);
  };

  return $;
};

export default globalVariable;
