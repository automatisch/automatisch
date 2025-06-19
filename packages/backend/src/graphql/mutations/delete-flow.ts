import Context from '../../types/express/context';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';

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
