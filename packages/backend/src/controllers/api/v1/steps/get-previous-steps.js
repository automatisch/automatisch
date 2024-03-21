import { ref } from 'objection';
import ExecutionStep from '../../../../models/execution-step.js';
import { renderObject } from '../../../../helpers/renderer.js';

export default async (request, response) => {
  const step = await request.currentUser.authorizedSteps
    .clone()
    .findOne({ 'steps.id': request.params.stepId })
    .throwIfNotFound();

  const previousSteps = await request.currentUser.authorizedSteps
    .clone()
    .withGraphJoined('executionSteps')
    .where('flow_id', '=', step.flowId)
    .andWhere('position', '<', step.position)
    .andWhere(
      'executionSteps.created_at',
      '=',
      ExecutionStep.query()
        .max('created_at')
        .where('step_id', '=', ref('steps.id'))
        .andWhere('status', 'success')
    )
    .orderBy('steps.position', 'asc');

  renderObject(response, previousSteps);
};
