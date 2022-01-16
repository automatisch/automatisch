import { useQuery } from '@apollo/client';
import { GET_FLOWS } from 'graphql/queries/get-flows';

import AppFlowRow from 'components/AppFlowRow';
import type { Flow } from 'types/flow';

export default function AppFlows(): React.ReactElement {
  const { data } = useQuery(GET_FLOWS);
  const appFlows: Flow[] = data?.getFlows || [];

  return (
    <>
      {appFlows.map((appFlow: Flow) => (
        <AppFlowRow key={appFlow.id} flow={appFlow} />
      ))}
    </>
  )
};
