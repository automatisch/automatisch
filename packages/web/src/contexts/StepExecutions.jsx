import * as React from 'react';
export const StepExecutionsContext = React.createContext([]);
export const StepExecutionsProvider = (props) => {
  const { children, value } = props;
  return (
    <StepExecutionsContext.Provider value={value}>
      {children}
    </StepExecutionsContext.Provider>
  );
};
