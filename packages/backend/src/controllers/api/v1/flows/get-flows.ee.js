import paginateRest from '../../../../helpers/pagination.js';
import { renderObject } from '../../../../helpers/renderer.js';
import Flow from '../../../../models/flow.js';

/**
 * @openapi
 * /v1/flows:
 *   get:
 *     summary: List flows
 *     description: Retrieves a list of flows, optionally filtered by query parameters.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Flows
 *     parameters:
 *       - in: query
 *         name: folderId
 *         description: Filter by folder ID
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         description: Filter by flow name
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         description: Filter by flow status
 *         schema:
 *           type: string
 *           enum: [published, draft]
 *       - in: query
 *         name: userId
 *         description: Filter by user ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of flows matching the filters
 */
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
