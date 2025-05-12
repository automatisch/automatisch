import paginateRest from '../../../../helpers/pagination.js';
import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

/**
 * @openapi
 * /user-invitations:
 *   get:
 *     summary: List user invitations
 *     description: Retrieves a paginated list of user invitations.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - User Invitations
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user invitations
 */
export default async (request, response) => {
  const usersQuery = User.query()
    .withGraphFetched({
      role: true,
    })
    .where({
      status: 'invited',
    })
    .orderBy('full_name', 'asc');

  const users = await paginateRest(usersQuery, request.query.page);

  renderObject(response, users, { serializer: 'PublicUserInvitation' });
};
