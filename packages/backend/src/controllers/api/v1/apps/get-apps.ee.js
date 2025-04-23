import App from '../../../../models/app.js';
import { renderObject } from '../../../../helpers/renderer.js';

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
