import { IGlobalVariable } from '@automatisch/types';
import { startCase } from 'lodash';

const capitalize = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;

  return startCase(input);
};

export default capitalize;
