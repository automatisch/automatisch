import { useQuery } from '@apollo/client';
import { Link, useSearchParams } from 'react-router-dom';
import { GET_FLOWS } from 'graphql/queries/get-flows';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import * as URLS from 'config/urls';
import AppFlowRow from 'components/FlowRow';
import NoResultFound from 'components/NoResultFound';
import useFormatMessage from 'hooks/useFormatMessage';
import type { IFlow } from '@automatisch/types';

type AppFlowsProps = {
  appKey: string;
};

const FLOW_PER_PAGE = 10;

const getLimitAndOffset = (page: number) => ({
  limit: FLOW_PER_PAGE,
  offset: (page - 1) * FLOW_PER_PAGE,
});

export default function AppFlows(props: AppFlowsProps): React.ReactElement {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const connectionId = searchParams.get('connectionId') || undefined;
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const { data } = useQuery(GET_FLOWS, {
    variables: {
      appKey,
      connectionId,
      ...getLimitAndOffset(page),
    },
  });
  const getFlows = data?.getFlows || {};
  const { pageInfo, edges } = getFlows;

  const flows: IFlow[] = edges?.map(({ node }: { node: IFlow }) => node);
  const hasFlows = flows?.length;

  if (!hasFlows) {
    return (
      <NoResultFound
        to={URLS.CREATE_FLOW_WITH_APP_AND_CONNECTION(appKey, connectionId)}
        text={formatMessage('app.noFlows')}
        data-test="flows-no-results"
      />
    );
  }

  return (
    <>
      {flows?.map((appFlow: IFlow) => (
        <AppFlowRow key={appFlow.id} flow={appFlow} />
      ))}

      {pageInfo && pageInfo.totalPages > 1 && (
        <Pagination
          sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
          page={pageInfo?.currentPage}
          count={pageInfo?.totalPages}
          onChange={(event, page) => setSearchParams({ page: page.toString() })}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      )}
    </>
  );
}
