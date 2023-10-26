import { raw } from 'objection';
import { DateTime } from 'luxon';
import Context from '../../types/express/context';
import Execution from '../../models/execution';
import paginate from '../../helpers/pagination';

type Filters = {
  flowId?: string;
  status?: string;
  createdAt?: {
    from?: string;
    to?: string;
  };
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
    .groupBy('executions.id')
    .orderBy('created_at', 'desc');

  const computedExecutions = Execution
    .query()
    .with('executions', executions)
    .withSoftDeleted()
    .withGraphFetched({
      flow: {
        steps: true,
      },
    });

  if (filters?.flowId) {
    computedExecutions.where('executions.flow_id', filters.flowId);
  }

  if (filters?.status) {
    computedExecutions.where('executions.status', filters.status);
  }

  if (filters?.createdAt) {
    const createdAtFilter = filters.createdAt;
    if (createdAtFilter.from) {
      const isoFromDateTime = DateTime
        .fromMillis(
          parseInt(createdAtFilter.from, 10)
        )
        .toISO();
      computedExecutions.where('executions.created_at', '>=', isoFromDateTime);
    }

    if (createdAtFilter.to) {
      const isoToDateTime = DateTime
        .fromMillis(
          parseInt(createdAtFilter.to, 10)
        )
        .toISO();
      computedExecutions.where('executions.created_at', '<=', isoToDateTime);
    }
  }

  return paginate(computedExecutions, params.limit, params.offset);
};

export default getExecutions;
