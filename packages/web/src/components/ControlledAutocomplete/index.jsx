import PropTypes from 'prop-types';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import FormHelperText from '@mui/material/FormHelperText';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';

const getOption = (options, value) =>
  options.find((option) => option.value === value) || null;

// Enables filtering by value in autocomplete dropdown
const filterOptions = createFilterOptions({
  stringify: ({ label, value }) => `
    ${label}
    ${value}
  `,
});

function ControlledAutocomplete(props) {
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
  let dependsOnValues = [];

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
              const typedSelectedOption = selectedOption;
              if (
                typedSelectedOption !== null &&
                Object.prototype.hasOwnProperty.call(
                  typedSelectedOption,
                  'value',
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

ControlledAutocomplete.propTypes = {
  shouldUnregister: PropTypes.bool,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  showOptionValue: PropTypes.bool,
  description: PropTypes.string,
  dependsOn: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.any,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  options: PropTypes.array,
};

export default ControlledAutocomplete;
