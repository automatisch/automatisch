import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  const executionsQuery = request.currentUser.authorizedExecutions
    .clone()
    .withSoftDeleted()
    .orderBy('created_at', 'desc')
    .withGraphFetched({
      flow: {
        steps: true,
      },
    });

  const executions = await paginateRest(executionsQuery, request.query.page);

  renderObject(response, executions);
};
