import { renderObject } from '@/helpers/renderer.js';

export default async (request, response) => {
  let step = await request.currentUser.readableSteps
    .clone()
    .findById(request.params.stepId)
    .throwIfNotFound();

  step = await step.continueWithoutTest();

  renderObject(response, step);
};
