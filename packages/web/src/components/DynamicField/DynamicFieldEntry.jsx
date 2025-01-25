import PropTypes from 'prop-types';
import * as React from 'react';
import Stack from '@mui/material/Stack';

import InputCreator from 'components/InputCreator';
import { EditorContext } from 'contexts/Editor';
import { FieldsPropType } from 'propTypes/propTypes';
import { FieldEntryProvider } from 'contexts/FieldEntry';
import useFieldEntryContext from 'hooks/useFieldEntryContext';

function DynamicFieldEntry(props) {
  const { fields, stepId, namePrefix } = props;
  const editorContext = React.useContext(EditorContext);
  const fieldEntryContext = useFieldEntryContext();

  const newFieldEntryPaths = [
    ...(fieldEntryContext?.fieldEntryPaths || []),
    namePrefix,
  ];

  return (
    <FieldEntryProvider value={{ fieldEntryPaths: newFieldEntryPaths }}>
      {fields.map((fieldSchema, fieldSchemaIndex) => (
        <Stack
          minWidth={0}
          flex="1 0 0px"
          spacing={2}
          key={`field-${namePrefix}-${fieldSchemaIndex}`}
        >
          <InputCreator
            schema={fieldSchema}
            namePrefix={namePrefix}
            disabled={editorContext.readOnly}
            shouldUnregister={false}
            stepId={stepId}
          />
        </Stack>
      ))}
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
