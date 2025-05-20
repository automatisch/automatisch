import Execution from '../../../../models/execution.js';
import { renderObject } from '../../../../helpers/renderer.js';
import paginateRest from '../../../../helpers/pagination.js';

/**
 * @openapi
 * /v1/executions:
 *   get:
 *     summary: List executions
 *     description: Retrieves a filtered list of executions based on query parameters.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Executions
 *     parameters:
 *       - in: query
 *         name: name
 *         description: Filter by execution name
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         description: Filter by execution status
 *         schema:
 *           type: string
 *           enum:
 *            - success
 *            - failure
 *       - in: query
 *         name: startDateTime
 *         description: Filter executions that started after this timestamp (in milliseconds)
 *         schema:
 *           type: integer
 *           format: int64
 *       - in: query
 *         name: endDateTime
 *         description: Filter executions that ended before this timestamp (in milliseconds)
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: List of executions matching the filters
 */
export default async (request, response) => {
  const executionsQuery = Execution.find(executionParams(request));

  const executions = await paginateRest(executionsQuery, request.query.page);

  renderObject(response, executions);
};

const executionParams = (request) => {
  return {
    name: request.query.name,
    status: request.query.status,
    startDateTime: request.query.startDateTime,
    endDateTime: request.query.endDateTime,
  };
};
