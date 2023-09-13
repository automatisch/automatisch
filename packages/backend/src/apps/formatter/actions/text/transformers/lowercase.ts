import { IGlobalVariable } from '@automatisch/types';

const lowercase = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;
  return input.toLowerCase();
};

export default lowercase;
