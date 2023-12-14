import * as React from 'react';
import { useQuery } from '@apollo/client';

import { GET_AUTOMATISCH_INFO } from 'graphql/queries/get-automatisch-info';

export type AutomatischInfoContextParams = {
  isCloud: boolean;
  isMation: boolean;
  loading: boolean;
};

export const AutomatischInfoContext =
  React.createContext<AutomatischInfoContextParams>({
    isCloud: false,
    isMation: false,
    loading: true,
  });

type AutomatischInfoProviderProps = {
  children: React.ReactNode;
};

export const AutomatischInfoProvider = (
  props: AutomatischInfoProviderProps
): React.ReactElement => {
  const { children } = props;
  const { data, loading } = useQuery(GET_AUTOMATISCH_INFO);

  const isCloud = data?.getAutomatischInfo?.isCloud;
  const isMation = data?.getAutomatischInfo?.isMation;

  const value = React.useMemo(() => {
    return {
      isCloud,
      isMation,
      loading,
    };
  }, [isCloud, isMation, loading]);

  return (
    <AutomatischInfoContext.Provider value={value}>
      {children}
    </AutomatischInfoContext.Provider>
  );
};
