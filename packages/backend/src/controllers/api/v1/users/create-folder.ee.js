import User from '../../../../models/user.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /users/{userId}/folders:
 *   post:
 *     summary: Create folder for user
 *     description: Creates a new folder for a specific user.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the folder
 *     responses:
 *       201:
 *         description: Folder created successfully
 */
export default async (request, response) => {
  const user = await User.query()
    .findById(request.params.userId)
    .throwIfNotFound();

  const folder = await user.$relatedQuery('folders').insertAndFetch({
    name: request.body.name,
  });

  renderObject(response, folder, { status: 201 });
};
