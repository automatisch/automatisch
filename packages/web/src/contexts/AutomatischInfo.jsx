import * as React from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUTOMATISCH_INFO } from 'graphql/queries/get-automatisch-info';
export const AutomatischInfoContext = React.createContext({
  isCloud: false,
  isMation: false,
  loading: true,
});
export const AutomatischInfoProvider = (props) => {
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
