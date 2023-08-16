import { IGlobalVariable } from '@automatisch/types';
import { capitalize as lodashCapitalize } from 'lodash';

const capitalize = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;
  const capitalizedInput = input.replace(/\w+/g, lodashCapitalize);

  return capitalizedInput;
};

export default capitalize;
