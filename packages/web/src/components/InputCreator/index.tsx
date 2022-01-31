import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { AppFields } from 'types/app';

import TextField from 'components/TextField';

type InputCreatorProps = {
  onChange?: React.ChangeEventHandler;
  onBlur?: React.FocusEventHandler;
  schema: AppFields;
};

export default function InputCreator(props: InputCreatorProps): React.ReactElement {
  const {
    onChange,
    onBlur,
    schema,
  } = props;

  const { control } = useFormContext();

  const {
    key: name,
    label,
    required,
    readOnly = false,
    value,
    description,
    clickToCopy,
  } = schema;

  return (
    <TextField
      defaultValue={value}
      required={required}
      placeholder=""
      disabled={readOnly}
      readOnly={readOnly}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      size="small"
      label={label}
      fullWidth
      helperText={description}
      control={control}
      clickToCopy={clickToCopy}
    />
  );
};
