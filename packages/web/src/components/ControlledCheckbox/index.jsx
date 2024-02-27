import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Checkbox from '@mui/material/Checkbox';
export default function ControlledCheckbox(props) {
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
