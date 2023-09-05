import { IGlobalVariable } from '@automatisch/types';

const randomNumber = ($: IGlobalVariable) => {
  const lowerRange = Number($.step.parameters.lowerRange) as number;
  const upperRange = Number($.step.parameters.upperRange) as number;

  return Math.floor(Math.random() * (upperRange - lowerRange + 1)) + lowerRange;
};

export default randomNumber;
