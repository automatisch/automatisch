import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import * as React from 'react';
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Can from 'components/Can';
import FlowsButtons from 'components/FlowsButtons';
import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import FlowRow from 'components/FlowRow';
import Folders from 'components/Folders';
import ImportFlowDialog from 'components/ImportFlowDialog';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import TemplatesDialog from 'components/TemplatesDialog/index.ee';
import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFlows from 'hooks/useFlows';
import useFormatMessage from 'hooks/useFormatMessage';

export default function Flows() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const flowName = searchParams.get('flowName') || '';
  const folderId = searchParams.get('folderId');
  const currentUserAbility = useCurrentUserAbility();
  const [searchValue, setSearchValue] = React.useState(flowName);

  const { data, isSuccess, isLoading } = useFlows({ flowName, page, folderId });

  const flows = data?.data || [];
  const pageInfo = data?.meta;
  const hasFlows = flows?.length;
  const navigateToLastPage = isSuccess && !hasFlows && page > 1;

  const onSearchChange = React.useCallback(
    (event) => {
      const value = event.target.value;
      setSearchValue(value);
      setSearchParams({
        flowName: value,
        ...(folderId && { folderId }),
      });
    },
    [folderId, setSearchParams],
  );

  const getPathWithSearchParams = (page, flowName) => {
    const searchParams = new URLSearchParams();

    if (folderId) {
      searchParams.set('folderId', folderId);
    }

    if (flowName) {
      searchParams.set('flowName', flowName);
    }

    if (page > 1) {
      searchParams.set('page', page);
    }

    return { search: searchParams.toString() };
  };

  const onDuplicateFlow = () => {
    if (pageInfo?.currentPage > 1) {
      navigate(getPathWithSearchParams(1, flowName));
    }
  };

  React.useEffect(
    function resetSearchValue() {
      if (!searchParams.has('flowName')) {
        setSearchValue('');
      }
    },
    [searchParams],
  );

  React.useEffect(
    function redirectToLastPage() {
      if (navigateToLastPage) {
        navigate(getPathWithSearchParams(pageInfo.totalPages, flowName));
      }
    },
    [navigateToLastPage],
  );

  return (
    <>
      <Box sx={{ py: 3 }}>
        <Container>
          <Grid
            container
            sx={{ mb: [0, 3] }}
            columnSpacing={1.5}
            rowSpacing={3}
          >
            <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
              <PageTitle>{formatMessage('flows.title')}</PageTitle>
            </Grid>

            <Grid item xs={12} md="auto" order={{ xs: 2, md: 1 }}>
              <SearchInput onChange={onSearchChange} value={searchValue} />
            </Grid>

            <Grid
              container
              item
              display="flex"
              direction="row"
              xs="auto"
              sm="auto"
              gap={1}
              alignItems="center"
              order={{ xs: 1 }}
            >
              <FlowsButtons />
            </Grid>
          </Grid>

          <Divider sx={{ mt: [2, 0], mb: 2 }} />

          <Grid container columnSpacing={2} rowSpacing={2}>
            <Grid item xs={12} sm={3}>
              <Folders />

              <Divider sx={{ mt: { xs: 2 }, display: { sm: 'none' } }} />
            </Grid>

            <Grid item xs={12} sm={9}>
              {(isLoading || navigateToLastPage) && (
                <CircularProgress
                  sx={{ display: 'block', margin: '20px auto' }}
                />
              )}

              {!isLoading &&
                flows?.map((flow) => (
                  <FlowRow
                    key={flow.id}
                    flow={flow}
                    onDuplicateFlow={onDuplicateFlow}
                  />
                ))}

              {!isLoading && !navigateToLastPage && !hasFlows && (
                <NoResultFound
                  text={formatMessage('flows.noFlows')}
                  {...(currentUserAbility.can('create', 'Flow') && {
                    to: URLS.CREATE_FLOW,
                  })}
                />
              )}

              {!isLoading &&
                !navigateToLastPage &&
                pageInfo &&
                pageInfo.totalPages > 1 && (
                  <Pagination
                    sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}
                    page={pageInfo?.currentPage}
                    count={pageInfo?.totalPages}
                    renderItem={(item) => (
                      <PaginationItem
                        component={Link}
                        to={getPathWithSearchParams(item.page, flowName)}
                        {...item}
                      />
                    )}
                  />
                )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Routes>
        <Route path="/import" element={<ImportFlowDialog />} />
        <Route path="/templates" element={<TemplatesDialog />} />
      </Routes>
    </>
  );
}
