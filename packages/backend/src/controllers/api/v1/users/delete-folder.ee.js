import User from '../../../../models/user.js';

/**
 * @openapi
 * /users/{userId}/folders/{folderId}:
 *   delete:
 *     summary: Delete folder
 *     description: Deletes a specific folder for a given user.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Folders
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: Unique identifier of the user
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: folderId
 *         description: Unique identifier of the folder
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Folder deleted successfully
 */
export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folder = await user
    .$relatedQuery('folders')
    .findById(request.params.folderId)
    .throwIfNotFound();

  await folder.delete();

  response.status(204).end();
};
