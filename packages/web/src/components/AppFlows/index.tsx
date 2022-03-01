import { useQuery } from '@apollo/client';
import { GET_FLOWS } from 'graphql/queries/get-flows';

import AppFlowRow from 'components/AppFlowRow';
import type { IFlow } from '@automatisch/types';

export default function AppFlows(): React.ReactElement {
  const { data } = useQuery(GET_FLOWS);
  const appFlows: IFlow[] = data?.getFlows || [];

  return (
    <>
      {appFlows.map((appFlow: IFlow) => (
        <AppFlowRow key={appFlow.id} flow={appFlow} />
      ))}
    </>
  )
};
