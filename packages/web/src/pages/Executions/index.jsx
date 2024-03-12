import * as React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import NoResultFound from 'components/NoResultFound';
import ExecutionRow from 'components/ExecutionRow';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import useFormatMessage from 'hooks/useFormatMessage';
import useExecutions from 'hooks/useExecutions';

export default function Executions() {
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '', 10) || 1;

  const { data, isLoading: isExecutionsLoading } = useExecutions(
    { page: page },
    { refetchInterval: 5000 },
  );

  const { data: executions, meta: pageInfo } = data || {};

  const hasExecutions = executions?.length;

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
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

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
