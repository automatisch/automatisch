import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';

type ControlledCheckboxProps = {
  name: string;
  defaultValue?: boolean;
  dataTest?: string;
} & Omit<CheckboxProps, 'defaultValue'>;

export default function ControlledCheckbox(
  props: ControlledCheckboxProps
): React.ReactElement {
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
