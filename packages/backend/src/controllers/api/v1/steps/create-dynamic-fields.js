import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const step = await request.currentUser.authorizedSteps
    .clone()
    .where('steps.id', request.params.stepId)
    .whereNotNull('steps.app_key')
    .first()
    .throwIfNotFound();

  const dynamicFields = await step.createDynamicFields(
    request.body.dynamicFieldsKey,
    request.body.parameters
  );

  renderObject(response, dynamicFields);
};
