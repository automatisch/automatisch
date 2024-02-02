import delayForAsMilliseconds from './delay-for-as-milliseconds.js';
import delayUntilAsMilliseconds from './delay-until-as-milliseconds.js';

const delayAsMilliseconds = (eventKey, computedParameters) => {
  let delayDuration = 0;

  if (eventKey === 'delayFor') {
    const { delayForUnit, delayForValue } = computedParameters;

    delayDuration = delayForAsMilliseconds(delayForUnit, Number(delayForValue));
  } else if (eventKey === 'delayUntil') {
    const { delayUntil } = computedParameters;
    delayDuration = delayUntilAsMilliseconds(delayUntil);
  }

  return delayDuration;
};

export default delayAsMilliseconds;
