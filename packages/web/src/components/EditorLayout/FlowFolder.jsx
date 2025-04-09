import { Link } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import * as React from 'react';
import Typography from '@mui/material/Typography';

import * as URLS from 'config/urls';
import useFlowFolder from 'hooks/useFlowFolder';
import useFormatMessage from 'hooks/useFormatMessage';

export default function FlowFolder(props) {
  const { flowId } = props;

  const formatMessage = useFormatMessage();
  const { data: folder, isLoading } = useFlowFolder(flowId);

  const name = folder?.data?.name || formatMessage('flowFolder.uncategorized');
  const id = folder?.data?.id || 'null';

  return (
    <Typography
      data-test="folder-name"
      component={Link}
      to={URLS.FOLDER_FLOWS(id)}
      variant="body1"
      noWrap
      color="inherit"
    >
      {!isLoading && name}
      {isLoading && (
        <CircularProgress data-test="search-for-app-loader" size={12} />
      )}
    </Typography>
  );
}
