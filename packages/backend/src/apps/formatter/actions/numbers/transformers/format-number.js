import accounting from 'accounting';

const formatNumber = ($) => {
  const input = $.step.parameters.input;
  const inputDecimalMark = $.step.parameters.inputDecimalMark;
  const toFormat = $.step.parameters.toFormat;

  const normalizedNumber = accounting.unformat(input, inputDecimalMark);
  const decimalPart = normalizedNumber.toString().split('.')[1];
  const precision = decimalPart ? decimalPart.length : 0;

  if (toFormat === '0') {
    // Comma for grouping & period for decimal
    return accounting.formatNumber(normalizedNumber, precision, ',', '.');
  } else if (toFormat === '1') {
    // Period for grouping & comma for decimal
    return accounting.formatNumber(normalizedNumber, precision, '.', ',');
  } else if (toFormat === '2') {
    // Space for grouping & period for decimal
    return accounting.formatNumber(normalizedNumber, precision, ' ', '.');
  } else if (toFormat === '3') {
    // Space for grouping & comma for decimal
    return accounting.formatNumber(normalizedNumber, precision, ' ', ',');
  }
};

export default formatNumber;
