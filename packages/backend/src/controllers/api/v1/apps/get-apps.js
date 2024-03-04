import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  let apps = await App.findAll(request.query.name);

  if (request.query.onlyWithTriggers === 'true') {
    apps = apps.filter((app) => app.triggers?.length);
  }

  if (request.query.onlyWithActions === 'true') {
    apps = apps.filter((app) => app.actions?.length);
  }

  renderObject(response, apps, { serializer: 'App' });
};
