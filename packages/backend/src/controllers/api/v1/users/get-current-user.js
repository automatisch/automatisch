import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  renderObject(response, request.currentUser);
};
