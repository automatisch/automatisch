import { raw } from 'objection';
import { DateTime } from 'luxon';
import Context from '../../types/express/context';
import Execution from '../../models/execution';
import paginate from '../../helpers/pagination';

type Filters = {
  flowId?: string;
  status?: string;
  updatedAt?: {
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
    .orderBy('updated_at', 'desc');

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

  if (filters?.updatedAt) {
    const updatedAtFilter = filters.updatedAt;
    if (updatedAtFilter.from) {
      const isoFromDateTime = DateTime
        .fromMillis(
          parseInt(updatedAtFilter.from, 10)
        )
        .toISO();
      computedExecutions.where('executions.updated_at', '>=', isoFromDateTime);
    }

    if (updatedAtFilter.to) {
      const isoToDateTime = DateTime
        .fromMillis(
          parseInt(updatedAtFilter.to, 10)
        )
        .toISO();
      computedExecutions.where('executions.updated_at', '<=', isoToDateTime);
    }
  }

  return paginate(computedExecutions, params.limit, params.offset);
};

export default getExecutions;
