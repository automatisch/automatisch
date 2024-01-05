import Flow from '../../models/flow.js';
import ExecutionStep from '../../models/execution-step.js';
import globalVariable from '../../helpers/global-variable.js';
import logger from '../../helpers/logger.js';

const deleteFlow = async (_parent, params, context) => {
  const conditions = context.currentUser.can('delete', 'Flow');
  const isCreator = conditions.isCreator;
  const allFlows = Flow.query();
  const userFlows = context.currentUser.$relatedQuery('flows');
  const baseQuery = isCreator ? userFlows : allFlows;

  const flow = await baseQuery
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  const triggerStep = await flow.getTriggerStep();
  const trigger = await triggerStep?.getTriggerCommand();

  if (trigger?.type === 'webhook' && trigger.unregisterHook) {
    const $ = await globalVariable({
      flow,
      connection: await triggerStep.$relatedQuery('connection'),
      app: await triggerStep.getApp(),
      step: triggerStep,
    });

    try {
      await trigger.unregisterHook($);
    } catch (error) {
      // suppress error as the remote resource might have been already deleted
      logger.debug(
        `Failed to unregister webhook for flow ${flow.id}: ${error.message}`
      );
    }
  }

  const executionIds = (
    await flow.$relatedQuery('executions').select('executions.id')
  ).map((execution) => execution.id);

  await ExecutionStep.query().delete().whereIn('execution_id', executionIds);

  await flow.$relatedQuery('executions').delete();
  await flow.$relatedQuery('steps').delete();
  await flow.$query().delete();

  return;
};

export default deleteFlow;
