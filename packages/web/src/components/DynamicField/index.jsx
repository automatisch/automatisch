import PropTypes from 'prop-types';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext, useWatch } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';

import { FieldsPropType } from 'propTypes/propTypes';
import DynamicFieldEntry from './DynamicFieldEntry';
import { FieldEntryProvider } from 'contexts/FieldEntry';
import useFieldEntryContext from 'hooks/useFieldEntryContext';

function DynamicField(props) {
  const {
    label,
    description,
    fields,
    name,
    defaultValue,
    stepId,
    addButtonLabel = '',
  } = props;

  const { control, setValue, getValues } = useFormContext();
  const fieldsValue = useWatch({ control, name });
  const fieldEntryContext = useFieldEntryContext();

  const createEmptyItem = React.useCallback(() => {
    return fields.reduce((previousValue, field) => {
      return {
        ...previousValue,
        [field.key]: field.value ?? '',
        __id: uuidv4(),
      };
    }, {});
  }, [fields]);

  const generateDefaultValue = React.useCallback(() => {
    if (defaultValue?.length > 0) {
      return defaultValue.map((item) => {
        return fields.reduce((previousValue, field) => {
          return {
            ...previousValue,
            // if field value is different than null or undefined - use it,
            // otherwise use the parent default value
            [field.key]: field.value ?? item[field.key] ?? '',
          };
        }, {});
      });
    } else {
      return [createEmptyItem()];
    }
  }, [defaultValue, fields, createEmptyItem]);

  const addItem = React.useCallback(() => {
    const values = getValues(name);
    if (!values) {
      setValue(name, [createEmptyItem()]);
    } else {
      setValue(name, values.concat(createEmptyItem()));
    }
  }, [getValues, createEmptyItem]);

  const removeItem = React.useCallback(
    (index) => {
      if (fieldsValue.length === 1) return;
      const newFieldsValue = fieldsValue.filter(
        (fieldValue, fieldIndex) => fieldIndex !== index,
      );
      setValue(name, newFieldsValue);
    },
    [fieldsValue],
  );

  React.useEffect(
    function addInitialGroupWhenEmpty() {
      const fieldValues = getValues(name);
      if (!fieldValues) {
        setValue(name, generateDefaultValue());
      }
    },
    [generateDefaultValue],
  );

  return (
    <FieldEntryProvider value={fieldEntryContext}>
      <Typography variant="subtitle2" sx={{ mb: 2, mt: 1 }}>
        {label}
      </Typography>

      <Stack spacing={2}>
        {fieldsValue?.map?.((field, index) => (
          <React.Fragment key={`fieldGroup-${field.__id}`}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Stack
                direction="column"
                spacing={2}
                sx={{
                  display: 'flex',
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <DynamicFieldEntry
                  fields={fields}
                  namePrefix={`${name}.${index}`}
                  stepId={stepId}
                />
              </Stack>
              <IconButton
                size="small"
                onClick={() => removeItem(index)}
                sx={{
                  width: 32,
                  height: 32,
                  color: 'text.secondary',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText',
                  },
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Stack>
            {index < fieldsValue.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center">
        <Stack spacing={{ xs: 2 }} sx={{ display: 'flex', flex: 1 }} />

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {addButtonLabel}
        </Typography>

        <IconButton
          size="small"
          edge="start"
          onClick={addItem}
          sx={{ width: 40, height: 40 }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      {description && (
        <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
          {description}
        </Typography>
      )}
    </FieldEntryProvider>
  );
}

DynamicField.propTypes = {
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string,
  fields: FieldsPropType.isRequired,
  stepId: PropTypes.string,
  addButtonLabel: PropTypes.string,
};

export default DynamicField;
