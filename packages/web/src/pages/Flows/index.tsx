import * as React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash/debounce';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import type { IFlow } from '@automatisch/types';

import Can from 'components/Can';
import FlowRow from 'components/FlowRow';
import NoResultFound from 'components/NoResultFound';
import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage';
import { GET_FLOWS } from 'graphql/queries/get-flows';
import * as URLS from 'config/urls';

const FLOW_PER_PAGE = 10;

const getLimitAndOffset = (page: number) => ({
  limit: FLOW_PER_PAGE,
  offset: (page - 1) * FLOW_PER_PAGE,
});

export default function Flows(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const [flowName, setFlowName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [getFlows, { data }] = useLazyQuery(GET_FLOWS, {
    onCompleted: () => {
      setLoading(false);
    },
  });

  const fetchData = React.useMemo(
    () =>
      debounce(
        (name) =>
          getFlows({
            variables: {
              ...getLimitAndOffset(page),
              name,
            },
          }),
        300
      ),
    [page, getFlows]
  );

  React.useEffect(
    function fetchFlowsOnSearch() {
      setLoading(true);

      fetchData(flowName);
    },
    [fetchData, flowName]
  );

  React.useEffect(
    function resetPageOnSearch() {
      // reset search params which only consists of `page`
      setSearchParams({});
    },
    [flowName]
  );

  React.useEffect(function cancelDebounceOnUnmount() {
    return () => {
      fetchData.cancel();
    };
  }, []);

  const { pageInfo, edges } = data?.getFlows || {};

  const flows: IFlow[] = edges?.map(({ node }: { node: IFlow }) => node);
  const hasFlows = flows?.length;

  const onSearchChange = React.useCallback((event) => {
    setFlowName(event.target.value);
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('flows.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>

          <Grid
            container
            item
            xs="auto"
            sm="auto"
            alignItems="center"
            order={{ xs: 1, sm: 2 }}
          >
            <Can I="create" a="Flow" passThrough>
              {(allowed) => (
                <ConditionalIconButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  component={Link}
                  fullWidth
                  disabled={!allowed}
                  icon={<AddIcon />}
                  to={URLS.CREATE_FLOW}
                  data-test="create-flow-button"
                >
                  {formatMessage('flows.create')}
                </ConditionalIconButton>
              )}
            </Can>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {loading && (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        )}

        {!loading &&
          flows?.map((flow) => <FlowRow key={flow.id} flow={flow} />)}

        {!loading && !hasFlows && (
          <NoResultFound
            text={formatMessage('flows.noFlows')}
            to={URLS.CREATE_FLOW}
          />
        )}

        {!loading && pageInfo && pageInfo.totalPages > 1 && (
          <Pagination
            sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
            page={pageInfo?.currentPage}
            count={pageInfo?.totalPages}
            onChange={(event, page) =>
              setSearchParams({ page: page.toString() })
            }
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
        )}
      </Container>
    </Box>
  );
}
