import * as React from 'react';
export const EditorContext = React.createContext({
  readOnly: false,
});
export const EditorProvider = (props) => {
  const { children, value } = props;
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};
