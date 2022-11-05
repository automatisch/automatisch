import * as React from 'react';

interface IEditorContext {
  readOnly: boolean;
}

export const EditorContext = React.createContext<IEditorContext>({
  readOnly: false,
});

type EditorProviderProps = {
  children: React.ReactNode;
  value: IEditorContext;
};

export const EditorProvider = (
  props: EditorProviderProps
): React.ReactElement => {
  const { children, value } = props;
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};
