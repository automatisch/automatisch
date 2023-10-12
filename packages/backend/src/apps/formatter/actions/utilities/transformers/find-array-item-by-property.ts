import { IGlobalVariable } from '@automatisch/types';
import { find } from 'lodash';

const findArrayItemByProperty = ($: IGlobalVariable) => {
  const value = JSON.parse($.step.parameters.value as string);
  const propertyName = $.step.parameters.propertyName as string;
  const propertyValue = $.step.parameters.propertyValue as string;

  const foundItem = find(value, { [propertyName]: propertyValue });
  return foundItem;
};

export default findArrayItemByProperty;
