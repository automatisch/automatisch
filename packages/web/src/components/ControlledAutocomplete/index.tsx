import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import type { IFieldDropdownOption } from '@automatisch/types';

interface ControlledAutocompleteProps
  extends AutocompleteProps<IFieldDropdownOption, boolean, boolean, boolean> {
  shouldUnregister?: boolean;
  name: string;
  required?: boolean;
  showOptionValue?: boolean;
  description?: string;
  dependsOn?: string[];
}

const getOption = (options: readonly IFieldDropdownOption[], value: string) =>
  options.find((option) => option.value === value) || null;

// Enables filtering by value in autocomplete dropdown
const filterOptions = createFilterOptions<IFieldDropdownOption>({
  stringify: ({ label, value }) => `
    ${label}
    ${value}
  `
})

function ControlledAutocomplete(
  props: ControlledAutocompleteProps
): React.ReactElement {
  const { control, watch, setValue, resetField } = useFormContext();

  const {
    required = false,
    name,
    defaultValue,
    shouldUnregister = false,
    onBlur,
    onChange,
    description,
    options = [],
    dependsOn = [],
    showOptionValue,
    ...autocompleteProps
  } = props;

  let dependsOnValues: unknown[] = [];
  if (dependsOn?.length) {
    dependsOnValues = watch(dependsOn);
  }

  React.useEffect(() => {
    const hasDependencies = dependsOnValues.length;
    const allDepsSatisfied = dependsOnValues.every(Boolean);

    if (hasDependencies && !allDepsSatisfied) {
      // Reset the field if any dependency is not satisfied
      setValue(name, null);
      resetField(name);
    }
  }, dependsOnValues);

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
        fieldState,
      }) => (
        <div style={{ width: '100%' }}>
          {/* encapsulated with an element such as div to vertical spacing delegated from parent */}
          <Autocomplete
            {...autocompleteProps}
            {...field}
            options={options}
            filterOptions={filterOptions}
            value={getOption(options, field.value)}
            onChange={(event, selectedOption, reason, details) => {
              const typedSelectedOption =
                selectedOption as IFieldDropdownOption;
              if (
                typedSelectedOption !== null &&
                Object.prototype.hasOwnProperty.call(
                  typedSelectedOption,
                  'value'
                )
              ) {
                controllerOnChange(typedSelectedOption.value);
              } else {
                controllerOnChange(typedSelectedOption);
              }

              onChange?.(event, selectedOption, reason, details);
            }}
            onBlur={(...args) => {
              controllerOnBlur();
              onBlur?.(...args);
            }}
            ref={ref}
            data-test={`${name}-autocomplete`}
            renderOption={(optionProps, option) => (
              <li
                {...optionProps}
                key={option.value?.toString()}
                style={{ flexDirection: 'column', alignItems: 'start' }}
              >
                <Typography>{option.label}</Typography>

                {showOptionValue && (
                  <Typography variant="caption">{option.value}</Typography>
                )}
              </li>
            )}
          />

          <FormHelperText
            variant="outlined"
            error={Boolean(fieldState.isTouched && fieldState.error)}
          >
            {fieldState.isTouched
              ? fieldState.error?.message || description
              : description}
          </FormHelperText>
        </div>
      )}
    />
  );
}

export default ControlledAutocomplete;
