import { renderObject } from '../../../../helpers/renderer.js';
import Flow from '../../../../models/flow.js';

export default async (request, response) => {
  const form = await Flow.query()
    .withGraphJoined({ steps: true })
    .orderBy('steps.position', 'asc')
    .findById(request.params.formId)
    .throwIfNotFound();

  const triggerStep = await form.getTriggerStep();

  if (triggerStep.appKey !== 'forms') {
    throw new Error('Invalid trigger step');
  }

  renderObject(response, form, { serializer: 'Form' });
};
