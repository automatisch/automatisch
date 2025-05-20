import { renderObject } from '../../../../../helpers/renderer.js';
import paginateRest from '../../../../../helpers/pagination.js';

export default async (request, response) => {
  await request.currentUser.hasFolderAccess(request.body.folderId);
  const currentUserFolderIds = await request.currentUser.getFolderIds();

  const flowsQuery = request.currentUser.getFlows(
    flowParams(request),
    currentUserFolderIds
  );

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};

const flowParams = (request) => {
  return {
    folderId: request.query.folderId,
    name: request.query.name,
    status: request.query.status,
    onlyOwnedFlows: request.query.onlyOwnedFlows,
  };
};
