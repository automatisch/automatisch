import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import PropTypes from 'prop-types';

import useFormatMessage from 'hooks/useFormatMessage';

function DropdownField({
  name,
  label,
  options = [],
  defaultValue = '',
  required = false,
  readonly = false,
}) {
  const formatMessage = useFormatMessage();

  return (
    <FormControl required={required} disabled={readonly}>
      <FormLabel>{label}</FormLabel>
      <Select
        name={name}
        defaultValue={defaultValue}
        placeholder={formatMessage('formFlow.chooseOption')}
        required={required}
        disabled={readonly}
      >
        {options.map((option, index) => (
          <Option key={index} value={option.value}>
            {option.value}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
}

DropdownField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
    }),
  ),
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default DropdownField;
