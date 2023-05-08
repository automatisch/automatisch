import { raw } from 'objection';
import Context from '../../types/express/context';
import paginate from '../../helpers/pagination';

type Params = {
  limit: number;
  offset: number;
};

const getExecutions = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const selectStatusStatement = `
    case
      when count(*) filter (where execution_steps.status = 'failure') > 0
        then 'failure'
      else 'success'
    end
    as status
  `;

  const executions = context.currentUser
    .$relatedQuery('executions')
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

  return paginate(executions, params.limit, params.offset);
};

export default getExecutions;
