import { assertIdempotencyKey } from './validators.js';

/**
 * Returns the Idempotency-Key for a send. An explicit key is used verbatim.
 * Otherwise the key is derived from the execution and step, which stay the
 * same for every re-processing of the same logical execution (Automatisch
 * does not retry action steps, and resumed executions keep their id), so the
 * same execution can never produce two real sends within Sent's 24-hour
 * idempotency window. Direct invocations without an execution send no key.
 */
const getIdempotencyKey = ($) => {
  const explicitKey = $.step.parameters.idempotencyKey;

  if (typeof explicitKey === 'string' && explicitKey.trim() !== '') {
    return assertIdempotencyKey(explicitKey.trim());
  }

  if ($.execution.id && $.step.id) {
    return `automatisch-${$.execution.id}-${$.step.id}`;
  }

  return undefined;
};

export default getIdempotencyKey;
