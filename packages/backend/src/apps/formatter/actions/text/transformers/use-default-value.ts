import { IGlobalVariable } from '@automatisch/types';

const useDefaultValue = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;

  if (input && input.trim().length > 0) {
    return input;
  }

  return $.step.parameters.defaultValue as string;
};

export default useDefaultValue;
