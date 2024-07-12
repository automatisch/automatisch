import createHttpClient from './http-client/index.js';
import EarlyExitError from '../errors/early-exit.js';
import AlreadyProcessedError from '../errors/already-processed.js';
import Datastore from '../models/datastore.js';

const globalVariable = async (options) => {
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

  const $ = {
    auth: {
      set: async (args) => {
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
    pushTriggerItem: (triggerItem) => {
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
    setActionItem: (actionItem) => {
      $.actionOutput.data = actionItem;
    },
    datastore: {
      get: async ({ key }) => {
        const datastore = await Datastore.query().findOne({
          key,
          scope: 'flow',
          scope_id: $.flow.id,
        });

        return {
          key: key,
          value: datastore?.value ?? null,
          [key]: datastore?.value ?? null,
        };
      },
      set: async ({ key, value }) => {
        let datastore = await Datastore.query()
          .where({ key, scope: 'flow', scope_id: $.flow.id })
          .first();

        if (datastore) {
          await datastore.$query().patchAndFetch({ value: value });
        } else {
          datastore = await Datastore.query().insert({
            key,
            value,
            scope: 'flow',
            scopeId: $.flow.id,
          });
        }

        return {
          key: datastore.key,
          value: datastore.value,
          [datastore.key]: datastore.value,
        };
      },
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

  const isAlreadyProcessed = (internalId) => {
    return lastInternalIds?.includes(internalId);
  };

  return $;
};

export default globalVariable;
