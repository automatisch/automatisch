import Context from '../../types/express/context';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';
import globalVariable from '../../helpers/global-variable';
import logger from '../../helpers/logger';

type Params = {
  input: {
    id: string;
  };
};

const deleteFlow = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('delete', 'Flow');

  const flow = await context.currentUser
    .$relatedQuery('flows')
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
      logger.debug(`Failed to unregister webhook for flow ${flow.id}: ${error.message}`);
    }
  }

  const executionIds = (
    await flow.$relatedQuery('executions').select('executions.id')
  ).map((execution: Execution) => execution.id);

  await ExecutionStep.query().delete().whereIn('execution_id', executionIds);

  await flow.$relatedQuery('executions').delete();
  await flow.$relatedQuery('steps').delete();
  await flow.$query().delete();

  return;
};

export default deleteFlow;
