import * as React from 'react';
import MuiTextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import type { IField, IFieldDropdownOption } from '@automatisch/types';

import useDynamicFields from 'hooks/useDynamicFields';
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
  showOptionValue?: boolean;
};

type RawOption = {
  name: string;
  value: string;
};

const optionGenerator = (options: RawOption[]): IFieldDropdownOption[] =>
  options?.map(({ name, value }) => ({ label: name as string, value: value }));

export default function InputCreator(
  props: InputCreatorProps
): React.ReactElement {
  const {
    onChange,
    onBlur,
    schema,
    namePrefix,
    stepId,
    disabled,
    showOptionValue,
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
  const {
    data: additionalFields,
    loading: additionalFieldsLoading
  } = useDynamicFields(stepId, schema);
  const computedName = namePrefix ? `${namePrefix}.${name}` : name;

  if (type === 'dropdown') {
    const preparedOptions = schema.options || optionGenerator(data);

    return (
      <React.Fragment>
        <ControlledAutocomplete
          name={computedName}
          dependsOn={dependsOn}
          fullWidth
          disablePortal
          disableClearable={required}
          options={preparedOptions}
          renderInput={(params) => <MuiTextField {...params} label={label} />}
          defaultValue={value as string}
          description={description}
          loading={loading}
          disabled={disabled}
          showOptionValue={showOptionValue}
        />

        {(additionalFieldsLoading && !additionalFields?.length) && <div>
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        </div>}

        {additionalFields?.map((field) => (
          <InputCreator
            key={field.key}
            schema={field}
            namePrefix="parameters"
            stepId={stepId}
            disabled={disabled}
            showOptionValue={true}
          />
        ))}
      </React.Fragment>
    );
  }

  if (type === 'string') {
    if (variables) {
      return (
        <React.Fragment>
          <PowerInput
            label={label}
            description={description}
            name={computedName}
            required={required}
            disabled={disabled}
          />

          {(additionalFieldsLoading && !additionalFields?.length) && <div>
            <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
          </div>}

          {additionalFields?.map((field) => (
            <InputCreator
              key={field.key}
              schema={field}
              namePrefix="parameters"
              stepId={stepId}
              disabled={disabled}
              showOptionValue={true}
            />
          ))}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <TextField
          defaultValue={value}
          required={required}
          placeholder=""
          readOnly={readOnly || disabled}
          onChange={onChange}
          onBlur={onBlur}
          name={computedName}
          label={label}
          fullWidth
          helperText={description}
          clickToCopy={clickToCopy}
        />

        {(additionalFieldsLoading && !additionalFields?.length) && <div>
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        </div>}

        {additionalFields?.map((field) => (
          <InputCreator
            key={field.key}
            schema={field}
            namePrefix="parameters"
            stepId={stepId}
            disabled={disabled}
            showOptionValue={true}
          />
        ))}
      </React.Fragment>
    );
  }

  return <React.Fragment />;
}
