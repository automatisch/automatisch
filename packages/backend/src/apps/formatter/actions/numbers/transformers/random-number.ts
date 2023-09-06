import { IGlobalVariable } from '@automatisch/types';

const randomNumber = ($: IGlobalVariable) => {
  const lowerRange = Number($.step.parameters.lowerRange);
  const upperRange = Number($.step.parameters.upperRange);
  const decimalPoints = Number($.step.parameters.decimalPoints) || 0;

  return Number(
    (Math.random() * (upperRange - lowerRange) + lowerRange).toFixed(
      decimalPoints
    )
  );
};

export default randomNumber;
