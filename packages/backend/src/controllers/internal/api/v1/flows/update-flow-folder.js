import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  let flow = await request.currentUser
    .$relatedQuery('flows')
    .findOne({
      id: request.params.flowId,
    })
    .throwIfNotFound();

  flow = await flow.updateFolder(request.body.folderId);

  renderObject(response, flow);
};
