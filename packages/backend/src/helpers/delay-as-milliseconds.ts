export type TDelayForUnit = 'minutes' | 'hours' | 'days' | 'weeks';

const delayAsMilliseconds = (
  delayForUnit: TDelayForUnit,
  delayForValue: number
) => {
  switch (delayForUnit) {
    case 'minutes':
      return delayForValue * 60 * 1000;
    case 'hours':
      return delayForValue * 60 * 60 * 1000;
    case 'days':
      return delayForValue * 24 * 60 * 60 * 1000;
    case 'weeks':
      return delayForValue * 7 * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
};

export default delayAsMilliseconds;
