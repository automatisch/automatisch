import { IGlobalVariable } from '@automatisch/types';

const trimWhitespace = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;
  return input.trim();
};

export default trimWhitespace;
