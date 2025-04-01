import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination.js';
import Flow from '../../../../models/flow.js';

export default async (request, response) => {
  const flowsQuery = request.currentUser.authorizedFlows
    .clone()
    .distinct('flows.*')
    .joinRelated({
      steps: true,
    })
    .withGraphFetched({
      steps: true,
    })
    .select('flows.*')
    .select(
      Flow.raw('flows.user_id = ? as "isOwner"', [request.currentUser.id])
    )
    .where('steps.connection_id', request.params.connectionId)
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};
