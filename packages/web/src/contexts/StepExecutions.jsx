import * as React from 'react';
import PropTypes from 'prop-types';
import { StepPropType } from 'propTypes/propTypes';

export const StepExecutionsContext = React.createContext([]);

export const StepExecutionsProvider = (props) => {
  const { children, value } = props;
  return (
    <StepExecutionsContext.Provider value={value}>
      {children}
    </StepExecutionsContext.Provider>
  );
};

StepExecutionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.arrayOf(StepPropType),
};
