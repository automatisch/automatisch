import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MuiColorInput, MuiColorInputProps } from 'mui-color-input';

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
    'data-test': dataTest,
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
          format="hex"
          {...textFieldProps}
          {...field}
          disabled={disabled}
          inputProps={{
            'data-test': dataTest,
          }}
        />
      )}
    />
  );
}
