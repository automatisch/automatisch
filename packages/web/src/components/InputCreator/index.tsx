import * as React from 'react';
import MuiTextField from '@mui/material/TextField';
import type { IField, IFieldDropdownOption } from '@automatisch/types';

import useDynamicData from 'hooks/useDynamicData';
import PowerInput from 'components/PowerInput';
import TextField from 'components/TextField';
import ControlledAutocomplete from 'components/ControlledAutocomplete';

type InputCreatorProps = {
  onChange?: React.ChangeEventHandler;
  onBlur?: React.FocusEventHandler;
  schema: IField;
  namePrefix?: string;
  stepId?: string;
  disabled?: boolean;
};

type RawOption = {
  name: string;
  value: string;
};

const optionGenerator = (options: RawOption[]): IFieldDropdownOption[] => options?.map(({ name, value }) => ({ label: name as string, value: value }));

export default function InputCreator(props: InputCreatorProps): React.ReactElement {
  const {
    onChange,
    onBlur,
    schema,
    namePrefix,
    stepId,
    disabled,
  } = props;

  const {
    key: name,
    label,
    required,
    readOnly = false,
    value,
    description,
    clickToCopy,
    variables,
    type,
    dependsOn,
  } = schema;

  const { data, loading } = useDynamicData(stepId, schema);
  const computedName = namePrefix ? `${namePrefix}.${name}` : name;

  if (type === 'dropdown') {
    const preparedOptions = schema.options || optionGenerator(data);

    return (
      <ControlledAutocomplete
        name={computedName}
        dependsOn={dependsOn}
        fullWidth
        disablePortal
        disableClearable={required}
        options={preparedOptions}
        renderInput={(params) => <MuiTextField {...params} label={label} />}
        defaultValue={value as string}
        onChange={console.log}
        description={description}
        loading={loading}
        disabled={disabled}
      />
    );
  }

  if (type === 'string') {
    if (variables) {
      return (
        <PowerInput
          label={label}
          description={description}
          name={computedName}
          required={required}
          disabled={disabled}
        />
      );
    }

    return (
      <TextField
        defaultValue={value}
        required={required}
        placeholder=""
        readOnly={readOnly || disabled}
        onChange={onChange}
        onBlur={onBlur}
        name={computedName}
        size="small"
        label={label}
        fullWidth
        helperText={description}
        clickToCopy={clickToCopy}
      />
    );
  }

  return (<React.Fragment />)
};
