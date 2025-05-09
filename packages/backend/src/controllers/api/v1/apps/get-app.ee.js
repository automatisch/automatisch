import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /v1/apps/{appKey}:
 *   get:
 *     summary: Retrieve an app
 *     description: Returns a specific app by its key.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Apps
 *     parameters:
 *       - in: path
 *         name: appKey
 *         required: true
 *         description: Unique key of the app (e.g., slack, github)
 *         schema:
 *           type: string
 */
export default async (request, response) => {
  const app = await App.findOneByKey(request.params.appKey);

  renderObject(response, app, { serializer: 'App' });
};
