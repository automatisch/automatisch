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
} from '@automatisch/types';
import EarlyExitError from '../errors/early-exit';

type GlobalVariableOptions = {
  connection?: Connection;
  app: IApp;
  flow?: Flow;
  step?: Step;
  execution?: Execution;
  testRun?: boolean;
};

const globalVariable = async (
  options: GlobalVariableOptions
): Promise<IGlobalVariable> => {
  const { connection, app, flow, step, execution, testRun = false } = options;

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
    },
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
        throw new EarlyExitError();
      }

      $.triggerOutput.data.push(triggerItem);

      if ($.execution.testRun) {
        // early exit after receiving one item as it is enough for test execution
        throw new EarlyExitError();
      }
    },
    setActionItem: (actionItem: IActionItem) => {
      $.actionOutput.data = actionItem;
    },
  };

  $.http = createHttpClient({
    $,
    baseURL: app.apiBaseUrl,
    beforeRequest: app.beforeRequest,
  });

  const lastInternalIds =
    testRun || (flow && step.isAction) ? [] : await flow?.lastInternalIds(2000);

  const isAlreadyProcessed = (internalId: string) => {
    return lastInternalIds?.includes(internalId);
  };

  return $;
};

export default globalVariable;
