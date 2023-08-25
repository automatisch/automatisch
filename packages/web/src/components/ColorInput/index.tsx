import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiColorInput, MuiColorInputProps } from 'mui-color-input';
import ColorButton from './ColorButton';

type ColorInputProps = {
  shouldUnregister?: boolean;
  name: string;
  'data-test'?: string;
} & Partial<MuiColorInputProps>;

export default function ColorInput(props: ColorInputProps): React.ReactElement {
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
