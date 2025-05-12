import User from '../../../../models/user.js';

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a specific user by ID.
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
 *       204:
 *         description: User deleted successfully
 */
export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  await user.softRemove();

  response.status(204).end();
};
