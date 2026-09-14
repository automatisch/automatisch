import globalVariable from '@/engine/global-variable.js';
import App from '@/models/app.js';
import { createConnection } from '@/factories/connection.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';

/**
 * Builds a real `$` (global variable) for an app step backed by database
 * records, so app code can be exercised the way the engine runs it.
 */
export const createGlobalVariable = async (params = {}) => {
  const { appKey } = params;
  const app = params.app || (await App.findOneByKey(appKey));

  const connection =
    params.connection ||
    (await createConnection({
      key: appKey,
      formattedData: params.formattedData,
    }));

  const flow = params.flow || (await createFlow());

  const step =
    params.step ||
    (await createStep({
      flowId: flow.id,
      type: params.stepType || 'action',
      appKey,
      key: params.stepKey,
      connectionId: connection.id,
      parameters: params.stepParameters || {},
    }));

  const $ = await globalVariable({
    connection,
    app,
    flow,
    step,
    execution: params.execution,
    request: params.request,
    testRun: params.testRun,
  });

  return { $, app, connection, flow, step };
};
