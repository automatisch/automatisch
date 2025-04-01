import { renderObject } from '../../../../helpers/renderer.js';
import App from '../../../../models/app.js';
import Flow from '../../../../models/flow.js';
import paginateRest from '../../../../helpers/pagination.js';

export default async (request, response) => {
  const app = await App.findOneByKey(request.params.appKey);

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
    .where('steps.app_key', app.key)
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};
