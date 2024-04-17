import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const apps = await request.currentUser.getApps(request.query.name);

  renderObject(response, apps, { serializer: 'App' });
};
