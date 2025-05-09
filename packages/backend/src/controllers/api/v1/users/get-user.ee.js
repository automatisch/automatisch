import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves details of a specific user.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: Unique identifier of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 */
export default async (request, response) => {
  const user = await User.query()
    .withGraphFetched({
      role: true,
    })
    .findById(request.params.userId)
    .throwIfNotFound();

  renderObject(response, user);
};
