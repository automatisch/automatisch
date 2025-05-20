import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

/**
 * @openapi
 * /v1/apps:
 *   get:
 *     summary: Retrieve all apps
 *     description: Returns a list of all available apps in Automatisch.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - Apps
 */
export default async (request, response) => {
  let apps = await App.findAll(request.query.name);

  if (request.query.onlyWithTriggers) {
    apps = apps.filter((app) => app.triggers?.length);
  }

  if (request.query.onlyWithActions) {
    apps = apps.filter((app) => app.actions?.length);
  }

  renderObject(response, apps, { serializer: 'App' });
};
