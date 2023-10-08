import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useFormContext, useWatch } from 'react-hook-form';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

import { IFieldDynamic } from '@automatisch/types';
import InputCreator from 'components/InputCreator';
import { EditorContext } from 'contexts/Editor';

interface DynamicFieldProps {
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  defaultValue?: Record<string, unknown>[];
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  description?: string;
  docUrl?: string;
  clickToCopy?: boolean;
  disabled?: boolean;
  fields: IFieldDynamic['fields'];
  shouldUnregister?: boolean;
  stepId?: string;
}

function DynamicField(props: DynamicFieldProps): React.ReactElement {
  const { label, description, fields, name, defaultValue, stepId } = props;
  const { control, setValue, getValues } = useFormContext();
  const fieldsValue = useWatch({ control, name }) as Record<string, unknown>[];
  const editorContext = React.useContext(EditorContext);

  const createEmptyItem = React.useCallback(() => {
    return fields.reduce((previousValue, field) => {
      return {
        ...previousValue,
        [field.key]: '',
        __id: uuidv4(),
      };
    }, {});
  }, [fields]);

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
        (fieldValue, fieldIndex) => fieldIndex !== index
      );

      setValue(name, newFieldsValue);
    },
    [fieldsValue]
  );

  React.useEffect(
    function addInitialGroupWhenEmpty() {
      const fieldValues = getValues(name);

      if (!fieldValues && defaultValue) {
        setValue(name, defaultValue);
      } else if (!fieldValues) {
        setValue(name, [createEmptyItem()]);
      }
    },
    [createEmptyItem, defaultValue]
  );

  return (
    <React.Fragment>
      <Typography variant="subtitle2">{label}</Typography>

      {fieldsValue?.map((field, index) => (
        <Stack direction="row" spacing={2} key={`fieldGroup-${field.__id}`}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 2 }}
            sx={{ display: 'flex', flex: 1 }}
          >
            {fields.map((fieldSchema, fieldSchemaIndex) => (
              <Box
                sx={{ display: 'flex', flex: '1 0 0px' }}
                key={`field-${field.__id}-${fieldSchemaIndex}`}
              >
                <InputCreator
                  schema={fieldSchema}
                  namePrefix={`${name}.${index}`}
                  disabled={editorContext.readOnly}
                  shouldUnregister={false}
                  stepId={stepId}
                />
              </Box>
            ))}
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
    </React.Fragment>
  );
}

export default DynamicField;
