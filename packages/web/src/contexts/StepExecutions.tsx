import * as React from 'react';
import type { IStep } from '@automatisch/types';

export const StepExecutionsContext = React.createContext<IStep[]>([]);

type StepExecutionsProviderProps = {
  children: React.ReactNode;
  value: IStep[];
};

export const StepExecutionsProvider = (
  props: StepExecutionsProviderProps
): React.ReactElement => {
  const { children, value } = props;
  return (
    <StepExecutionsContext.Provider value={value}>
      {children}
    </StepExecutionsContext.Provider>
  );
};
