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
      $.triggerOutput.data.push(triggerItem);

      if (
        $.execution.testRun ||
        isAlreadyProcessed(triggerItem.meta.internalId)
      ) {
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
    testRun || (flow && step.isAction) ? [] : await flow?.lastInternalIds();

  const isAlreadyProcessed = (internalId: string) => {
    return lastInternalIds?.includes(internalId);
  };

  return $;
};

export default globalVariable;
