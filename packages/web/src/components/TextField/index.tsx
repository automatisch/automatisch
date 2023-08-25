import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import copyInputValue from 'helpers/copyInputValue';

type TextFieldProps = {
  shouldUnregister?: boolean;
  name: string;
  clickToCopy?: boolean;
  readOnly?: boolean;
  'data-test'?: string;
} & MuiTextFieldProps;

const createCopyAdornment = (
  ref: React.RefObject<HTMLInputElement | null>
): React.ReactElement => {
  return (
    <InputAdornment position="end">
      <IconButton
        onClick={() => copyInputValue(ref.current as HTMLInputElement)}
        edge="end"
      >
        <ContentCopyIcon color="primary" />
      </IconButton>
    </InputAdornment>
  );
};

export default function TextField(props: TextFieldProps): React.ReactElement {
  const { control } = useFormContext();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const {
    required,
    name,
    defaultValue,
    shouldUnregister = false,
    clickToCopy = false,
    readOnly = false,
    disabled = false,
    onBlur,
    onChange,
    'data-test': dataTest,
    ...textFieldProps
  } = props;

  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue || ''}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({
        field: {
          ref,
          onChange: controllerOnChange,
          onBlur: controllerOnBlur,
          ...field
        },
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
        />
      )}
    />
  );
}
