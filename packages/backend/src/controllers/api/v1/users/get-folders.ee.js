import User from '../../../../models/user.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /users/{userId}/folders:
 *   get:
 *     summary: List folders for user
 *     description: Retrieves all folders belonging to a specific user.
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
 *     responses:
 *       200:
 *         description: List of folders
 */
export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folders = await user.$relatedQuery('folders').orderBy('name', 'asc');

  renderObject(response, folders, { serializer: 'Folder' });
};
