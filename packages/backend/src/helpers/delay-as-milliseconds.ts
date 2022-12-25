import Step from '../models/step';
import delayForAsMilliseconds, {
  TDelayForUnit,
} from './delay-for-as-milliseconds';
import delayUntilAsMilliseconds from './delay-until-as-milliseconds';

const delayAsMilliseconds = (step: Step) => {
  let delayDuration = 0;

  if (step.key === 'delayFor') {
    const { delayForUnit, delayForValue } = step.parameters;

    delayDuration = delayForAsMilliseconds(
      delayForUnit as TDelayForUnit,
      Number(delayForValue)
    );
  } else if (step.key === 'delayUntil') {
    const { delayUntil } = step.parameters;
    delayDuration = delayUntilAsMilliseconds(delayUntil as string);
  }

  return delayDuration;
};

export default delayAsMilliseconds;
