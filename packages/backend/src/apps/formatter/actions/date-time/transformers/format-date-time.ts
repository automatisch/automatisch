import { IGlobalVariable } from '@automatisch/types';
import { DateTime } from 'luxon';

const formatDateTime = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;

  const fromFormat = $.step.parameters.fromFormat as string;
  const fromTimezone = $.step.parameters.fromTimezone as string;

  const inputDateTime = DateTime.fromFormat(input, fromFormat, {
    zone: fromTimezone,
    setZone: true,
  });

  const toFormat = $.step.parameters.toFormat as string;
  const toTimezone = $.step.parameters.toTimezone as string;

  const outputDateTime = inputDateTime.setZone(toTimezone).toFormat(toFormat);

  return outputDateTime;
};

export default formatDateTime;
