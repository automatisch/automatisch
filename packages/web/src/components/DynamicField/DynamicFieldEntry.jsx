import PropTypes from 'prop-types';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useWatch, useFormContext } from 'react-hook-form';

import InputCreator from 'components/InputCreator';
import { EditorContext } from 'contexts/Editor';
import { FieldsPropType } from 'propTypes/propTypes';
import { FieldEntryProvider } from 'contexts/FieldEntry';
import useFieldEntryContext from 'hooks/useFieldEntryContext';

function DynamicFieldEntry(props) {
  const { fields, stepId, namePrefix } = props;
  const editorContext = React.useContext(EditorContext);
  const fieldEntryContext = useFieldEntryContext();
  const { control } = useFormContext();

  const newFieldEntryPaths = [
    ...(fieldEntryContext?.fieldEntryPaths || []),
    namePrefix,
  ];

  // Watch the current field group values for conditional rendering
  const currentValues = useWatch({ control, name: namePrefix });

  return (
    <FieldEntryProvider value={{ fieldEntryPaths: newFieldEntryPaths }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          flexWrap: 'wrap',
          '& > *': {
            minWidth: { xs: '100%', sm: '200px' },
            flex: { xs: '1 1 100%', sm: '1 1 0' },
          },
        }}
      >
        {fields.map((fieldSchema, fieldSchemaIndex) => {
          const shouldShow = fieldSchema.showWhen
            ? fieldSchema.showWhen(currentValues)
            : true;

          if (!shouldShow) {
            return null;
          }

          return (
            <Box
              key={`field-${namePrefix}-${fieldSchemaIndex}`}
              sx={{
                ...(fieldSchema.type === 'dynamic' && {
                  flex: '1 1 100%',
                  minWidth: '100%',
                }),
              }}
            >
              <InputCreator
                schema={fieldSchema}
                namePrefix={namePrefix}
                disabled={editorContext.readOnly}
                shouldUnregister={false}
                stepId={stepId}
              />
            </Box>
          );
        })}
      </Stack>
    </FieldEntryProvider>
  );
}

DynamicFieldEntry.propTypes = {
  stepId: PropTypes.string,
  namePrefix: PropTypes.string,
  index: PropTypes.number,
  fields: FieldsPropType.isRequired,
};

export default DynamicFieldEntry;
