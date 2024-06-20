import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const subscription = await request.currentUser
    .$relatedQuery('currentSubscription')
    .throwIfNotFound();

  renderObject(response, subscription);
};
