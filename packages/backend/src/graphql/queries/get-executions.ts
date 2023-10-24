import { raw } from 'objection';
import Context from '../../types/express/context';
import Execution from '../../models/execution';
import paginate from '../../helpers/pagination';

type Filters = {
  flowId?: string;
  status?: string;
}

type Params = {
  limit: number;
  offset: number;
  filters?: Filters;
};

const getExecutions = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('read', 'Execution');
  const filters = params.filters;

  const userExecutions = context.currentUser.$relatedQuery('executions');
  const allExecutions = Execution.query();
  const executionBaseQuery = conditions.isCreator ? userExecutions : allExecutions;

  const selectStatusStatement = `
    case
      when count(*) filter (where execution_steps.status = 'failure') > 0
        then 'failure'
      else 'success'
    end
    as status
  `;

  const executions = executionBaseQuery
    .clone()
    .joinRelated('executionSteps as execution_steps')
    .select('executions.*', raw(selectStatusStatement))
    .withSoftDeleted()
    .withGraphFetched({
      flow: {
        steps: true,
      },
    })
    .groupBy('executions.id')
    .orderBy('updated_at', 'desc');

  const computedExecutions = Execution.query().with('executions', executions);

  if (filters?.flowId) {
    computedExecutions.where('executions.flow_id', filters.flowId);
  }

  if (filters?.status) {
    computedExecutions.where('executions.status', filters.status);
  }
  return paginate(computedExecutions, params.limit, params.offset);
};

export default getExecutions;
