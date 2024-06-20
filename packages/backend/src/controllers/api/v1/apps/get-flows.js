import { renderObject } from '../../../../helpers/renderer.js';
import App from '../../../../models/app.js';
import paginateRest from '../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  const app = await App.findOneByKey(request.params.appKey);

  const flowsQuery = request.currentUser.authorizedFlows
    .clone()
    .joinRelated({
      steps: true,
    })
    .withGraphFetched({
      steps: true,
    })
    .where('steps.app_key', app.key)
    .orderBy('active', 'desc')
    .orderBy('updated_at', 'desc');

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};
