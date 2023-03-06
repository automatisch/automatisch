import * as React from 'react';
import { useQuery } from '@apollo/client';

import { GET_AUTOMATISCH_INFO } from 'graphql/queries/get-automatisch-info';

export type AutomatischInfoContextParams = {
  isCloud: boolean;
};

export const AutomatischInfoContext =
  React.createContext<AutomatischInfoContextParams>({
    isCloud: false,
  });

type AutomatischInfoProviderProps = {
  children: React.ReactNode;
};

export const AutomatischInfoProvider = (
  props: AutomatischInfoProviderProps
): React.ReactElement => {
  const { children } = props;
  const { data } = useQuery(GET_AUTOMATISCH_INFO);

  const isCloud = data?.getAutomatischInfo?.isCloud || false;

  const value = React.useMemo(() => {
    return {
      isCloud,
    };
  }, [isCloud]);

  return (
    <AutomatischInfoContext.Provider value={value}>
      {children}
    </AutomatischInfoContext.Provider>
  );
};
