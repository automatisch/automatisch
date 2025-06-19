import PropTypes from 'prop-types';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext, useWatch } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { FieldsPropType } from 'propTypes/propTypes';
import DynamicFieldEntry from './DynamicFieldEntry';
import { FieldEntryProvider } from 'contexts/FieldEntry';
import useFieldEntryContext from 'hooks/useFieldEntryContext';

function DynamicField(props) {
  const { label, description, fields, name, defaultValue, stepId } = props;
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
      <Typography variant="subtitle2">{label}</Typography>
      {fieldsValue?.map?.((field, index) => (
        <Stack direction="row" spacing={2} key={`fieldGroup-${field.__id}`}>
          <Stack
            direction={{
              xs: 'column',
              sm: fields.length > 2 ? 'column' : 'row',
            }}
            spacing={{ xs: 2 }}
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
            edge="start"
            onClick={() => removeItem(index)}
            sx={{ width: 61, height: 61 }}
          >
            <RemoveIcon />
          </IconButton>
        </Stack>
      ))}
      <Stack direction="row" spacing={2}>
        <Stack spacing={{ xs: 2 }} sx={{ display: 'flex', flex: 1 }} />
        <IconButton
          size="small"
          edge="start"
          onClick={addItem}
          sx={{ width: 61, height: 61 }}
        >
          <AddIcon />
        </IconButton>
      </Stack>
      <Typography variant="caption">{description}</Typography>
    </FieldEntryProvider>
  );
}

DynamicField.propTypes = {
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  required: PropTypes.bool,
  readOnly: PropTypes.bool,
  description: PropTypes.string,
  docUrl: PropTypes.string,
  clickToCopy: PropTypes.bool,
  disabled: PropTypes.bool,
  fields: FieldsPropType.isRequired,
  shouldUnregister: PropTypes.bool,
  stepId: PropTypes.string,
};

export default DynamicField;
