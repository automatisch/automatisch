import User from '../../../../models/user.js';

/**
 * @openapi
 * /user-invitations/{userId}:
 *   delete:
 *     summary: Delete user invitation
 *     description: Deletes a specific user invitation.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - User Invitations
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: Unique identifier of the user invitation to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User invitation deleted successfully
 */
export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .where({ status: 'invited' })
    .throwIfNotFound();

  await user.$query().delete();

  response.status(204).end();
};
