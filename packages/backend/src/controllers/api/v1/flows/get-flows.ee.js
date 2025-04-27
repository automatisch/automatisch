import paginateRest from '../../../../helpers/pagination.js';
import { renderObject } from '../../../../helpers/renderer.js';
import Flow from '../../../../models/flow.js';

export default async (request, response) => {
  const flowsQuery = Flow.find(flowParams(request));

  const flows = await paginateRest(flowsQuery, request.query.page);

  renderObject(response, flows);
};

const flowParams = (request) => {
  return {
    folderId: request.query.folderId,
    name: request.query.name,
    status: request.query.status,
    userId: request.query.userId,
  };
};
