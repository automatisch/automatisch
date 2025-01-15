import * as React from 'react';
import { FieldEntryContext } from 'contexts/FieldEntry';

export default function useFieldEntryContext() {
  const fieldEntryContext = React.useContext(FieldEntryContext);

  return fieldEntryContext;
}
