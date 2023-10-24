import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormControlLabel, {
  FormControlLabelProps,
} from '@mui/material/FormControlLabel';
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch';

type SwitchProps = {
  name: string;
  label: string;
  shouldUnregister?: boolean;
  FormControlLabelProps?: Partial<FormControlLabelProps>;
} & MuiSwitchProps;

export default function Switch(props: SwitchProps): React.ReactElement {
  const { control } = useFormContext();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const {
    required,
    name,
    defaultChecked = false,
    shouldUnregister = false,
    disabled = false,
    onBlur,
    onChange,
    label,
    FormControlLabelProps,
    className,
    ...switchProps
  } = props;

  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultChecked}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({
        field: {
          ref,
          onChange: controllerOnChange,
          onBlur: controllerOnBlur,
          value,
          ...field
        },
      }) => (
        <FormControlLabel
          className={className}
          {...FormControlLabelProps}
          control={
            <MuiSwitch
              {...switchProps}
              {...field}
              checked={value}
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
            />
          }
          label={label}
        />
      )}
    />
  );
}
