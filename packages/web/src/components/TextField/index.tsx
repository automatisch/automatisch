import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField, { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";
import copyInputValue from 'helpers/copyInputValue';
import { useRef } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";

type TextFieldProps = {
  control?: Control<FieldValues>;
  shouldUnregister?: boolean;
  name: string;
  clickToCopy?: boolean;
  readOnly?: boolean;
} & MuiTextFieldProps;

const createCopyAdornment = (ref: React.RefObject<HTMLInputElement | null>) => {
  return (
  <InputAdornment position="end">
    <IconButton
      onClick={() => copyInputValue(ref.current as HTMLInputElement)}
      edge="end"
    >
      <ContentCopyIcon />
    </IconButton>
  </InputAdornment>
);
}

export default function TextField(props: TextFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const {
    control,
    required,
    name,
    defaultValue,
    shouldUnregister,
    clickToCopy,
    readOnly,
    ...textFieldProps
  } = props;

  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue || ''}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field: { ref, ...field } }) => (
        <MuiTextField
          {...textFieldProps}
          {...field}
          inputRef={(element) => { inputRef.current = element; ref(element); }}
          InputProps={{ readOnly, endAdornment: clickToCopy ? createCopyAdornment(inputRef) : null}}
        />
      )}
    />
  );
};

TextField.defaultProps = {
  readOnly: false,
  disabled: false,
  clickToCopy: false,
  shouldUnregister: false,
};
