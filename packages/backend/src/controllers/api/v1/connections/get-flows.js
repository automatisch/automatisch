import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  const flowsQuery = request.currentUser.authorizedFlows
    .clone()
    .joinRelated({
      steps: true,
    })
    .withGraphFetched({
      steps: true,
    })
    .where('steps.connection_id', request.params.connectionId)
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};
