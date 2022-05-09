import { useQuery } from '@apollo/client';
import { GET_FLOWS } from 'graphql/queries/get-flows';

import AppFlowRow from 'components/AppFlowRow';
import type { IFlow } from '@automatisch/types';

type AppFlowsProps = {
  appKey: string;
}

export default function AppFlows(props: AppFlowsProps): React.ReactElement {
  const { appKey } = props;
  const { data } = useQuery(GET_FLOWS, { variables: { appKey }});
  const appFlows: IFlow[] = data?.getFlows || [];

  return (
    <>
      {appFlows.map((appFlow: IFlow) => (
        <AppFlowRow key={appFlow.id} flow={appFlow} />
      ))}
    </>
  )
};
