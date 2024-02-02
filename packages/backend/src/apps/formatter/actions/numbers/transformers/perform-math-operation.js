import add from 'lodash/add.js';
import divide from 'lodash/divide.js';
import multiply from 'lodash/multiply.js';
import subtract from 'lodash/subtract.js';

const mathOperation = ($) => {
  const mathOperation = $.step.parameters.mathOperation;
  const values = $.step.parameters.values.map((value) => Number(value.input));

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
