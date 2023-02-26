import Step from '../models/step';
import delayForAsMilliseconds, {
  TDelayForUnit,
} from './delay-for-as-milliseconds';
import delayUntilAsMilliseconds from './delay-until-as-milliseconds';

const delayAsMilliseconds = (eventKey: Step["key"], computedParameters: Step["parameters"]) => {
  let delayDuration = 0;

  if (eventKey === 'delayFor') {
    const { delayForUnit, delayForValue } = computedParameters;

    delayDuration = delayForAsMilliseconds(
      delayForUnit as TDelayForUnit,
      Number(delayForValue)
    );
  } else if (eventKey === 'delayUntil') {
    const { delayUntil } = computedParameters;
    delayDuration = delayUntilAsMilliseconds(delayUntil as string);
  }

  return delayDuration;
};

export default delayAsMilliseconds;
