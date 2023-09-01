import { IGlobalVariable } from '@automatisch/types';

const replace = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;

  const find = $.step.parameters.find as string;
  const replace = $.step.parameters.replace as string;

  return input.replaceAll(find, replace);
};

export default replace;
