import { IGlobalVariable, IJSONObject } from '@automatisch/types';
import { add, divide, multiply, subtract } from 'lodash';

const mathOperation = ($: IGlobalVariable) => {
  const mathOperation = $.step.parameters.mathOperation as string;
  const values = ($.step.parameters.values as IJSONObject[]).map((value) =>
    Number(value.input)
  ) as number[];

  if (mathOperation === 'add') {
    return values.reduce((acc, curr) => add(acc, curr), 0);
  } else if (mathOperation === 'divide') {
    return values.reduce((acc, curr) => divide(acc, curr));
  } else if (mathOperation === 'makeNegative') {
    return values.map((value) => -value);
  } else if (mathOperation === 'multiply') {
    return values.reduce((acc, curr) => multiply(acc, curr), 1);
  } else if (mathOperation === 'subtract') {
    return values.reduce((acc, curr) => subtract(acc, curr));
  }
};

export default mathOperation;
