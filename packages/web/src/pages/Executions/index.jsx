import * as React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import SearchInput from 'components/SearchInput';
import ExecutionFilters from 'components/ExecutionFilters';
import NoResultFound from 'components/NoResultFound';
import ExecutionRow from 'components/ExecutionRow';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import useFormatMessage from 'hooks/useFormatMessage';
import useExecutions from 'hooks/useExecutions';
import useExecutionFilters from 'hooks/useExecutionFilters';
import objectifyUrlSearchParams from 'helpers/objectifyUrlSearchParams';

export default function Executions() {
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const { requestFriendlyFilters } = useExecutionFilters();
  const navigate = useNavigate();
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const name = searchParams.get('name') || '';
  const [searchValue, setSearchValue] = React.useState(name);

  const {
    data,
    isSuccess,
    isLoading: isExecutionsLoading,
  } = useExecutions(
    { page, name, ...requestFriendlyFilters },
    { refetchInterval: 5000 },
  );

  const executions = data?.data || [];
  const pageInfo = data?.meta;
  const hasExecutions = executions?.length;
  const navigateToLastPage = isSuccess && !hasExecutions && page > 1;

  const onSearchChange = React.useCallback(
    (event) => {
      const value = event.target.value;

      setSearchValue(value);

      setSearchParams({
        name: value,
        ...requestFriendlyFilters,
      });
    },
    [requestFriendlyFilters, setSearchParams],
  );

  const getPathWithSearchParams = (page) => {
    const searchParamsObject = objectifyUrlSearchParams(searchParams);

    const newSearchParams = new window.URLSearchParams({
      ...searchParamsObject,
      page,
    });

    return { search: newSearchParams.toString() };
  };

  React.useEffect(
    function resetSearchValue() {
      if (!searchParams.has('name')) {
        setSearchValue('');
      }
    },
    [searchParams],
  );

  React.useEffect(
    function redirectToLastPage() {
      if (navigateToLastPage) {
        navigate(getPathWithSearchParams(pageInfo.totalPages));
      }
    },
    [navigateToLastPage],
  );

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid
            container
            item
            xs
            sm
            alignItems="center"
            order={{ xs: 0, height: 80 }}
          >
            <PageTitle>{formatMessage('executions.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} md="auto" order={{ xs: 2, md: 1 }}>
            <SearchInput onChange={onSearchChange} value={searchValue} />
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        <Grid item xs={12}>
          <ExecutionFilters />
        </Grid>

        {isExecutionsLoading && (
          <CircularProgress
            data-test="executions-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        {!isExecutionsLoading && !hasExecutions && (
          <NoResultFound text={formatMessage('executions.noExecutions')} />
        )}

        {!isExecutionsLoading &&
          executions?.map((execution) => (
            <ExecutionRow key={execution.id} execution={execution} />
          ))}

        {pageInfo && pageInfo.totalPages > 1 && (
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
                to={getPathWithSearchParams(item.page)}
                {...item}
              />
            )}
          />
        )}
      </Container>
    </Box>
  );
}
