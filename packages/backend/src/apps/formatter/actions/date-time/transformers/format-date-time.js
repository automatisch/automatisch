import { DateTime } from 'luxon';

const formatDateTime = ($) => {
  const input = $.step.parameters.input;

  const fromFormat = $.step.parameters.fromFormat;
  const fromTimezone = $.step.parameters.fromTimezone;

  const inputDateTime = DateTime.fromFormat(input, fromFormat, {
    zone: fromTimezone,
    setZone: true,
  });

  const toFormat = $.step.parameters.toFormat;
  const toTimezone = $.step.parameters.toTimezone;

  const outputDateTime = inputDateTime.setZone(toTimezone).toFormat(toFormat);

  return outputDateTime;
};

export default formatDateTime;
