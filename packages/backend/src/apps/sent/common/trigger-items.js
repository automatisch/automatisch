import isEmpty from 'lodash/isEmpty.js';
import getEventInternalId from './get-event-internal-id.js';

export const buildTriggerItem = (event) => ({
  raw: event,
  meta: {
    internalId: getEventInternalId(event),
  },
});

/**
 * Test runs replay the last event the flow received; before any delivery a
 * documented sample event is used so that fields can be mapped.
 */
export const getTestRunEvent = async ($, sampleEvent) => {
  const lastExecutionStep = await $.getLastExecutionStep();

  return isEmpty(lastExecutionStep?.dataOut)
    ? sampleEvent
    : lastExecutionStep.dataOut;
};
