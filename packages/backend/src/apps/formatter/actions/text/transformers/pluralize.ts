import { IGlobalVariable } from '@automatisch/types';
import pluralizeLibrary from 'pluralize';

const pluralize = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;
  return pluralizeLibrary(input);
};

export default pluralize;
