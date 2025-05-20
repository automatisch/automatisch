import paginateRest from '../../../../helpers/pagination.js';
import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List users
 *     description: Retrieves a paginated list of users.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of users
 */
export default async (request, response) => {
  const usersQuery = User.query()
    .where({ status: 'active' })
    .withGraphFetched({
      role: true,
    })
    .orderBy('full_name', 'asc');

  const users = await paginateRest(usersQuery, request.query.page);

  renderObject(response, users);
};
