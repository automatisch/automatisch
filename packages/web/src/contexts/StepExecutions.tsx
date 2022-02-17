import * as React from 'react';
import { Step } from 'types/step';

export const StepExecutionsContext = React.createContext<Step[]>([]);

type StepExecutionsProviderProps = {
  children: React.ReactNode;
  value: Step[];
}

export const StepExecutionsProvider = (props: StepExecutionsProviderProps): React.ReactElement => {
  const { children, value } = props;
  return (
    <StepExecutionsContext.Provider
      value={value}
    >
      {children}
    </StepExecutionsContext.Provider>
  );
};