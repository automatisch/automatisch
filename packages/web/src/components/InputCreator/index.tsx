import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import MuiTextField from '@mui/material/TextField';
import type { IField, IFieldDropdown, IJSONObject } from '@automatisch/types';

import { GET_DATA } from 'graphql/queries/get-data';
import PowerInput from 'components/PowerInput';
import TextField from 'components/TextField';
import ControlledAutocomplete from 'components/ControlledAutocomplete';

type InputCreatorProps = {
  onChange?: React.ChangeEventHandler;
  onBlur?: React.FocusEventHandler;
  schema: IField;
  namePrefix?: string;
  stepId?: string;
};

type RawOption = {
  name: string;
  value: string;
};

type Option = {
  label: string;
  value: string;
};

const computeArguments = (args: IFieldDropdown["source"]["arguments"]): IJSONObject => args.reduce((result, { name, value }) => ({ ...result, [name as string]: value as string }), {});
const optionGenerator = (options: RawOption[]): Option[] => options?.map(({ name, value }) => ({ label: name as string, value: value as string }));
const getOption = (options: Option[], value: string) => options?.find(option => option.value === value);

export default function InputCreator(props: InputCreatorProps): React.ReactElement {
  const {
    onChange,
    onBlur,
    schema,
    namePrefix,
    stepId,
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
  } = schema;

  const [getData, { called, data }] = useLazyQuery(GET_DATA);

  React.useEffect(() => {
    if (schema.type === 'dropdown' && stepId && schema.source && !called) {
      getData({
        variables: {
          stepId,
          ...computeArguments(schema.source.arguments),
        }
      })
    }
  }, [getData, called, stepId, schema]);


  const computedName = namePrefix ? `${namePrefix}.${name}` : name;

  if (type === 'dropdown') {
    const options = optionGenerator(data?.getData);

    return (
      <ControlledAutocomplete
        name={computedName}
        fullWidth
        disablePortal
        disableClearable={true}
        options={options}
        renderInput={(params) => <MuiTextField {...params} label={label} />}
        value={getOption(options, value)}
        onChange={console.log}
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
        clickToCopy={clickToCopy}
      />
    );
  }

  return (<React.Fragment />)
};
