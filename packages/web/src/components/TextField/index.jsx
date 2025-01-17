import PropTypes from 'prop-types';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import MuiTextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import copyInputValue from 'helpers/copyInputValue';

const createCopyAdornment = (ref) => {
  return (
    <InputAdornment position="end">
      <IconButton onClick={() => copyInputValue(ref.current)} edge="end">
        <ContentCopyIcon color="primary" />
      </IconButton>
    </InputAdornment>
  );
};

function TextField(props) {
  const { control } = useFormContext();
  const inputRef = React.useRef(null);
  const {
    required,
    name,
    defaultValue = '',
    shouldUnregister = false,
    clickToCopy = false,
    readOnly = false,
    disabled = false,
    onBlur,
    onChange,
    'data-test': dataTest,
    showError = false,
    ...textFieldProps
  } = props;
  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({
        field: {
          ref,
          onChange: controllerOnChange,
          onBlur: controllerOnBlur,
          ...field
        },
        fieldState: { error },
      }) => (
        <MuiTextField
          {...textFieldProps}
          {...field}
          required={required}
          disabled={disabled}
          onChange={(...args) => {
            controllerOnChange(...args);
            onChange?.(...args);
          }}
          onBlur={(...args) => {
            controllerOnBlur();
            onBlur?.(...args);
          }}
          inputRef={(element) => {
            inputRef.current = element;
            ref(element);
          }}
          InputProps={{
            readOnly,
            endAdornment: clickToCopy ? createCopyAdornment(inputRef) : null,
          }}
          inputProps={{
            'data-test': dataTest,
          }}
          {...(showError && { helperText: error?.message, error: !!error })}
        />
      )}
    />
  );
}

TextField.propTypes = {
  required: PropTypes.bool,
  defaultValue: PropTypes.string,
  shouldUnregister: PropTypes.bool,
  name: PropTypes.string.isRequired,
  clickToCopy: PropTypes.bool,
  readOnly: PropTypes.bool,
  'data-test': PropTypes.string,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  showError: PropTypes.bool,
};

export default TextField;
