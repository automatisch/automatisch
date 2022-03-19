import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

interface ControlledAutocompleteProps extends AutocompleteProps<Option, boolean, boolean, boolean> {
  shouldUnregister?: boolean;
  name: string;
  required?: boolean;
}

type Option = {
  label: string;
  value: string;
}

const getOption = (options: readonly Option[], value: string) => options.find(option => option.value === value);

function ControlledAutocomplete(props: ControlledAutocompleteProps): React.ReactElement {
  const { control } = useFormContext();

  const {
    required = false,
    name,
    defaultValue,
    shouldUnregister,
    onBlur,
    onChange,
    ...autocompleteProps
  } = props;

  if (!autocompleteProps.options) return (<React.Fragment />);

  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue || ''}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field: { ref, onChange: controllerOnChange, onBlur: controllerOnBlur, ...field } }) => (
        <Autocomplete
          {...autocompleteProps}
          {...field}
          value={getOption(autocompleteProps.options, field.value)}
          onChange={(event, selectedOption, reason, details) => {
            const typedSelectedOption = selectedOption as Option;
            if (typedSelectedOption?.value) {
              controllerOnChange(typedSelectedOption.value);
            } else {
              controllerOnChange(typedSelectedOption);
            }

            onChange?.(event, selectedOption, reason, details);
          }}
          onBlur={(...args) => { controllerOnBlur(); onBlur?.(...args); }}
          ref={ref}
        />
      )}
    />
  );
}

export default ControlledAutocomplete;
