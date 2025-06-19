import * as React from 'react';
import PropTypes from 'prop-types';

export const FieldEntryContext = React.createContext({});

export const FieldEntryProvider = (props) => {
  const { children, value } = props;

  return (
    <FieldEntryContext.Provider value={value}>
      {children}
    </FieldEntryContext.Provider>
  );
};

FieldEntryProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.object,
};
