import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const user = await request.currentUser
    .$query()
    .patchAndFetch({ password: request.body.password });

  renderObject(response, user);
};
