import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiColorInput } from 'mui-color-input';
import ColorButton from './ColorButton';
export default function ColorInput(props) {
  const { control } = useFormContext();
  const {
    required,
    name,
    shouldUnregister = false,
    disabled = false,
    ...textFieldProps
  } = props;
  return (
    <Controller
      rules={{ required }}
      name={name}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field }) => (
        <MuiColorInput
          Adornment={ColorButton}
          format="hex"
          {...textFieldProps}
          {...field}
          disabled={disabled}
          inputProps={{
            'data-test': 'color-text-field',
          }}
        />
      )}
    />
  );
}
