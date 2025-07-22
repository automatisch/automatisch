import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import PropTypes from 'prop-types';

import useFormatMessage from 'hooks/useFormatMessage';

const getInputType = (validationFormat) => {
  const typeMap = {
    email: 'email',
    url: 'url',
    tel: 'tel',
    number: 'number',
  };
  return typeMap[validationFormat] || 'text';
};

const getValidationPattern = (validationFormat, customPattern) => {
  // For email, let HTML5 input type handle validation natively
  if (validationFormat === 'email') {
    return undefined;
  }
  if (validationFormat === 'tel') return '[+]?[0-9\\s\\-\\(\\)]+';
  if (validationFormat === 'alphanumeric') return '[a-zA-Z0-9]+';
  if (validationFormat === 'custom') return customPattern;
  return undefined;
};

function StringField({
  name,
  label,
  defaultValue = '',
  required = false,
  readonly = false,
  validationFormat,
  validationPattern,
  validationHelperText,
  onChange,
}) {
  const formatMessage = useFormatMessage();

  const getValidationMessage = (validationFormat, validationHelperText) => {
    if (validationHelperText) return validationHelperText;

    const messageMap = {
      email: 'formFlow.invalidEmail',
      url: 'formFlow.invalidUrl',
      tel: 'formFlow.invalidTel',
      number: 'formFlow.invalidNumber',
      alphanumeric: 'formFlow.invalidAlphanumeric',
    };

    const messageKey =
      messageMap[validationFormat] || 'formFlow.invalidPattern';
    return formatMessage(messageKey);
  };

  return (
    <FormControl required={required} disabled={readonly}>
      <FormLabel>{label}</FormLabel>
      <Input
        name={name}
        defaultValue={defaultValue}
        required={required}
        disabled={readonly}
        type={getInputType(validationFormat)}
        onChange={onChange}
        slotProps={{
          input: {
            pattern: getValidationPattern(validationFormat, validationPattern),
            title: getValidationMessage(validationFormat, validationHelperText),
          },
        }}
      />
    </FormControl>
  );
}

StringField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  validationFormat: PropTypes.string,
  validationPattern: PropTypes.string,
  validationHelperText: PropTypes.string,
  onChange: PropTypes.func,
};

export default StringField;
