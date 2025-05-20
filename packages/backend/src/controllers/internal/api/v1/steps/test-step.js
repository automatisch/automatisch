import { renderObject } from '../../../../../helpers/renderer.js';

export default async (request, response) => {
  let step = await request.currentUser.authorizedSteps
    .clone()
    .findById(request.params.stepId)
    .throwIfNotFound();

  step = await step.test();

  renderObject(response, step);
};
