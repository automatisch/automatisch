import * as React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

interface ControlledAutocompleteProps extends AutocompleteProps<Option, boolean, boolean, boolean> {
  shouldUnregister?: boolean;
  name: string;
  required?: boolean;
  description?: string;
}

type Option = {
  label: string;
  value: string;
}

const getOption = (options: readonly Option[], value: string) => options.find(option => option.value === value) || null;

function ControlledAutocomplete(props: ControlledAutocompleteProps): React.ReactElement {
  const { control } = useFormContext();

  const {
    required = false,
    name,
    defaultValue,
    shouldUnregister,
    onBlur,
    onChange,
    description,
    options = [],
    ...autocompleteProps
  } = props;

  return (
    <Controller
      rules={{ required }}
      name={name}
      defaultValue={defaultValue || ''}
      control={control}
      shouldUnregister={shouldUnregister}
      render={({ field: { ref, onChange: controllerOnChange, onBlur: controllerOnBlur, ...field }, fieldState }) => (
        <div>
          {/* encapsulated with an element such as div to vertical spacing delegated from parent */}
          <Autocomplete
            {...autocompleteProps}
            {...field}
            options={options}
            value={getOption(options, field.value)}
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

          <FormHelperText
            variant="outlined"
            error={Boolean(fieldState.isTouched && fieldState.error)}
          >
            {fieldState.isTouched ? fieldState.error?.message || description : description}
          </FormHelperText>
        </div>
      )}
    />
  );
}

export default ControlledAutocomplete;
