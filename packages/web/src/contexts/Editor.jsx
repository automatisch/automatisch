import * as React from 'react';
import PropTypes from 'prop-types';

export const EditorContext = React.createContext({
  readOnly: false,
});

export const EditorProvider = (props) => {
  const { children, value } = props;
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
};

EditorProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.shape({ readOnly: PropTypes.bool.isRequired }).isRequired,
};
