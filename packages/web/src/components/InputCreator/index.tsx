import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import type { IField } from '@automatisch/types';

import PowerInput from 'components/PowerInput';
import TextField from 'components/TextField';

type InputCreatorProps = {
  onChange?: React.ChangeEventHandler;
  onBlur?: React.FocusEventHandler;
  schema: IField;
  namePrefix?: string;
};

export default function InputCreator(props: InputCreatorProps): React.ReactElement {
  const {
    onChange,
    onBlur,
    schema,
    namePrefix,
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
    variables,
  } = schema;

  const computedName = namePrefix ? `${namePrefix}.${name}` : name;

  if (variables) {
    return (
      <PowerInput
        label={label}
        description={description}
        control={control}
        name={computedName}
        required={required}
        // onBlur={onBlur}
      />
    );
  }

  return (
    <TextField
      defaultValue={value}
      required={required}
      placeholder=""
      disabled={readOnly}
      readOnly={readOnly}
      onChange={onChange}
      onBlur={onBlur}
      name={computedName}
      size="small"
      label={label}
      fullWidth
      helperText={description}
      control={control}
      clickToCopy={clickToCopy}
    />
  );
};
