import { useQuery } from '@apollo/client';
import { GET_FLOWS } from 'graphql/queries/get-flows';

import AppFlowRow from 'components/FlowRow';
import type { IFlow } from '@automatisch/types';

type AppFlowsProps = {
  appKey: string;
}

export default function AppFlows(props: AppFlowsProps): React.ReactElement {
  const { appKey } = props;
  const { data } = useQuery(GET_FLOWS, { variables: { appKey, limit: 100, offset: 0 }});
  const getFlows = data?.getFlows || {};
  const { edges } = getFlows;

  const appFlows: IFlow[] = edges?.map(({ node }: { node: IFlow }) => node);

  return (
    <>
      {appFlows?.map((appFlow: IFlow) => (
        <AppFlowRow key={appFlow.id} flow={appFlow} />
      ))}
    </>
  )
};
