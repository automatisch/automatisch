import FormControl from '@mui/joy/FormControl';
import Checkbox from '@mui/joy/Checkbox';
import PropTypes from 'prop-types';

function CheckboxField({
  dataTest,
  name,
  label,
  defaultValue,
  required = false,
  readonly = false,
}) {
  const defaultChecked = defaultValue === 'true' || defaultValue === 'on';

  return (
    <FormControl data-test={dataTest} required={required} disabled={readonly}>
      <Checkbox
        name={name}
        label={`${label}${required ? ' *' : ''}`}
        defaultChecked={defaultChecked}
        value="true"
        required={required}
        disabled={readonly}
      />
    </FormControl>
  );
}

CheckboxField.propTypes = {
  dataTest: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
};

export default CheckboxField;
