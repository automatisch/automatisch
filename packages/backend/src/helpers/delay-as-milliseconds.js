import delayForAsMilliseconds from './delay-for-as-milliseconds';
import delayUntilAsMilliseconds from './delay-until-as-milliseconds';

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
