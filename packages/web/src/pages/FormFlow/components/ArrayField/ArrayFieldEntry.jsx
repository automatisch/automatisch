import * as React from 'react';
import Stack from '@mui/joy/Stack';
import PropTypes from 'prop-types';

import StringField from '../StringField';
import MultilineField from '../MultilineField';
import CheckboxField from '../CheckboxField';
import DropdownField from '../DropdownField';
import DateField from '../DateField';
import TimeField from '../TimeField';
import DateTimeField from '../DateTimeField';

function ArrayFieldEntry(props) {
  const {
    fields,
    namePrefix,
    searchParamsObject = {},
    dateFormat,
    timeFormat,
  } = props;

  return (
    <Stack spacing={2}>
      {fields.map((field) => {
        const fieldName = `${namePrefix}.${field.key}`;
        const defaultValue = searchParamsObject[fieldName] || '';

        return (
          <React.Fragment key={field.key}>
            {field.type === 'string' && (
              <StringField
                name={fieldName}
                label={field.name}
                defaultValue={defaultValue}
                required={field.required}
                readonly={field.readonly}
                validationFormat={field.validationFormat}
                validationPattern={field.validationPattern}
                validationHelperText={field.validationHelperText}
              />
            )}

            {field.type === 'multiline' && (
              <MultilineField
                name={fieldName}
                label={field.name}
                defaultValue={defaultValue}
                required={field.required}
                readonly={field.readonly}
              />
            )}

            {field.type === 'checkbox' && (
              <CheckboxField
                name={fieldName}
                label={field.name}
                defaultValue={defaultValue}
                required={field.required}
                readonly={field.readonly}
              />
            )}

            {field.type === 'dropdown' && (
              <DropdownField
                name={fieldName}
                label={field.name}
                options={field.options || []}
                defaultValue={defaultValue}
                required={field.required}
                readonly={field.readonly}
              />
            )}

            {field.type === 'date' && (
              <DateField
                name={fieldName}
                label={field.name}
                format={dateFormat}
                defaultValue={defaultValue || null}
                required={field.required}
                readonly={field.readonly}
              />
            )}

            {field.type === 'time' && (
              <TimeField
                name={fieldName}
                label={field.name}
                format={timeFormat}
                defaultValue={defaultValue || null}
                required={field.required}
                readonly={field.readonly}
              />
            )}

            {field.type === 'datetime' && (
              <DateTimeField
                name={fieldName}
                label={field.name}
                format={`${dateFormat} ${timeFormat}`}
                defaultValue={defaultValue || null}
                required={field.required}
                readonly={field.readonly}
              />
            )}
          </React.Fragment>
        );
      })}
    </Stack>
  );
}

ArrayFieldEntry.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      required: PropTypes.bool,
      readonly: PropTypes.bool,
      options: PropTypes.array,
      validationFormat: PropTypes.string,
      validationPattern: PropTypes.string,
      validationHelperText: PropTypes.string,
    }),
  ).isRequired,
  namePrefix: PropTypes.string.isRequired,
  dateFormat: PropTypes.string.isRequired,
  timeFormat: PropTypes.string.isRequired,
  searchParamsObject: PropTypes.object,
};

export default ArrayFieldEntry;
