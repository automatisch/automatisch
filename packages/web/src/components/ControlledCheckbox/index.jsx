import * as React from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';

function ControlledCheckbox(props) {
  const { control } = useFormContext();
  const {
    required,
    name,
    defaultValue = false,
    disabled = false,
    onBlur,
    onChange,
    dataTest,
    ...checkboxProps
  } = props;
  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue}
      control={control}
      render={({
        field: {
          ref,
          onChange: controllerOnChange,
          onBlur: controllerOnBlur,
          value,
          name,
          ...field
        },
      }) => {
        return (
          <Checkbox
            {...checkboxProps}
            {...field}
            checked={!!value}
            name={name}
            disabled={disabled}
            onChange={(...args) => {
              controllerOnChange(...args);
              onChange?.(...args);
            }}
            onBlur={(...args) => {
              controllerOnBlur();
              onBlur?.(...args);
            }}
            inputRef={ref}
            data-test={dataTest}
          />
        );
      }}
    />
  );
}

ControlledCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  defaultValue: PropTypes.bool,
  dataTest: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
};

export default ControlledCheckbox;
