import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  await request.currentUser.hasFolderAccess(request.body.folderId);

  const flowsQuery = request.currentUser.getFlows(flowParams(request));
  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};

const flowParams = (request) => {
  return { folderId: request.query.folderId, name: request.query.name };
};
