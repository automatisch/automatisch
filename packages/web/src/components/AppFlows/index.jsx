import PropTypes from 'prop-types';
import { Link, useSearchParams } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

import * as URLS from 'config/urls';
import AppFlowRow from 'components/FlowRow';
import Can from 'components/Can';
import NoResultFound from 'components/NoResultFound';
import useFormatMessage from 'hooks/useFormatMessage';
import useConnectionFlows from 'hooks/useConnectionFlows';
import useAppFlows from 'hooks/useAppFlows';

function AppFlows(props) {
  const { appKey } = props;
  const formatMessage = useFormatMessage();
  const [searchParams, setSearchParams] = useSearchParams();
  const connectionId = searchParams.get('connectionId') || undefined;
  const page = parseInt(searchParams.get('page') || '', 10) || 1;
  const isConnectionFlowEnabled = !!connectionId;
  const isAppFlowEnabled = !!appKey && !connectionId;

  const connectionFlows = useConnectionFlows(
    { connectionId, page },
    { enabled: isConnectionFlowEnabled },
  );

  const appFlows = useAppFlows({ appKey, page }, { enabled: isAppFlowEnabled });

  const flows = isConnectionFlowEnabled
    ? connectionFlows?.data?.data || []
    : appFlows?.data?.data || [];
  const pageInfo = isConnectionFlowEnabled
    ? connectionFlows?.data?.meta || []
    : appFlows?.data?.meta || [];
  const hasFlows = flows?.length;

  if (!hasFlows) {
    return (
      <Can I="manage" a="Flow" passThrough>
        {(allowed) => (
          <NoResultFound
            text={formatMessage('app.noFlows')}
            data-test="flows-no-results"
            {...(allowed && {
              to: URLS.CREATE_FLOW,
            })}
          />
        )}
      </Can>
    );
  }

  return (
    <>
      {flows?.map((appFlow) => (
        <AppFlowRow key={appFlow.id} flow={appFlow} appKey={appKey} />
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

AppFlows.propTypes = {
  appKey: PropTypes.string.isRequired,
};

export default AppFlows;
