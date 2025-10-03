import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import PropTypes from 'prop-types';

function MultilineField({
  dataTest,
  name,
  label,
  defaultValue = '',
  required = false,
  readonly = false,
  minRows = 3,
}) {
  return (
    <FormControl data-test={dataTest} required={required} disabled={readonly}>
      <FormLabel>{label}</FormLabel>
      <Textarea
        name={name}
        defaultValue={defaultValue}
        minRows={minRows}
        required={required}
        disabled={readonly}
      />
    </FormControl>
  );
}

MultilineField.propTypes = {
  dataTest: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  readonly: PropTypes.bool,
  minRows: PropTypes.number,
};

export default MultilineField;
