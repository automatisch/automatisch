import * as React from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Controller, useFormContext } from 'react-hook-form';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import type { IFieldDropdownOption } from '@automatisch/types';

interface ControlledAutocompleteProps
  extends AutocompleteProps<IFieldDropdownOption, boolean, boolean, boolean> {
  shouldUnregister?: boolean;
  name: string;
  required?: boolean;
  description?: string;
  dependsOn?: string[];
}

const getOption = (options: readonly IFieldDropdownOption[], value: string) =>
  options.find((option) => option.value === value) || null;

function ControlledAutocomplete(
  props: ControlledAutocompleteProps
): React.ReactElement {
  const { control, watch, setValue, resetField } = useFormContext();

  const {
    required = false,
    name,
    defaultValue,
    shouldUnregister,
    onBlur,
    onChange,
    description,
    options = [],
    dependsOn = [],
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
        <div>
          {/* encapsulated with an element such as div to vertical spacing delegated from parent */}
          <Autocomplete
            {...autocompleteProps}
            {...field}
            options={options}
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
              <li {...optionProps} key={option.value.toString()}>
                {option.label}
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
