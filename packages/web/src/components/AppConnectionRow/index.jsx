import * as React from 'react';
import { useMutation } from '@apollo/client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import Skeleton from '@mui/material/Skeleton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { DateTime } from 'luxon';
import { useQueryClient } from '@tanstack/react-query';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import ConnectionContextMenu from 'components/AppConnectionContextMenu';
import { DELETE_CONNECTION } from 'graphql/mutations/delete-connection';
import useFormatMessage from 'hooks/useFormatMessage';
import { ConnectionPropType } from 'propTypes/propTypes';
import { CardContent, Typography } from './style';
import useConnectionFlows from 'hooks/useConnectionFlows';
import useTestConnection from 'hooks/useTestConnection';

const countTranslation = (value) => (
  <>
    <Typography variant="body1">{value}</Typography>
    <br />
  </>
);

function AppConnectionRow(props) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { id, key, formattedData, verified, createdAt, reconnectable } =
    props.connection;
  const [verificationVisible, setVerificationVisible] = React.useState(false);
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const queryClient = useQueryClient();

  const [deleteConnection] = useMutation(DELETE_CONNECTION);

  const { mutate: testConnection, isPending: isTestConnectionPending } =
    useTestConnection(
      { connectionId: id },
      {
        onSettled: () => {
          setTimeout(() => setVerificationVisible(false), 3000);
        },
      },
    );

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data, isLoading: isConnectionFlowsLoading } = useConnectionFlows({
    connectionId: id,
  });
  const flowCount = data?.meta?.count;

  const onContextMenuClick = () => setAnchorEl(contextButtonRef.current);

  const onContextMenuAction = React.useCallback(
    async (event, action) => {
      if (action.type === 'delete') {
        await deleteConnection({
          variables: { input: { id } },
          update: (cache) => {
            const connectionCacheId = cache.identify({
              __typename: 'Connection',
              id,
            });
            cache.evict({
              id: connectionCacheId,
            });
          },
        });

        await queryClient.invalidateQueries({
          queryKey: ['apps', key, 'connections'],
        });
        enqueueSnackbar(formatMessage('connection.deletedMessage'), {
          variant: 'success',
          SnackbarProps: {
            'data-test': 'snackbar-delete-connection-success',
          },
        });
      } else if (action.type === 'test') {
        setVerificationVisible(true);
        testConnection({ variables: { id } });
      }
    },
    [deleteConnection, id, queryClient, key, enqueueSnackbar, formatMessage, testConnection],
  );

  const relativeCreatedAt = DateTime.fromMillis(
    parseInt(createdAt, 10),
  ).toRelative();

  return (
    <>
      <Card sx={{ my: 2 }} data-test="app-connection-row">
        <CardActionArea onClick={onContextMenuClick}>
          <CardContent>
            <Stack justifyContent="center" alignItems="flex-start" spacing={1}>
              <Typography variant="h6" sx={{ textAlign: 'left' }}>
                {formattedData?.screenName}
              </Typography>

              <Typography variant="caption">
                {formatMessage('connection.addedAt', {
                  datetime: relativeCreatedAt,
                })}
              </Typography>
            </Stack>

            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                {verificationVisible && isTestConnectionPending && (
                  <>
                    <CircularProgress size={16} />
                    <Typography variant="caption">
                      {formatMessage('connection.testing')}
                    </Typography>
                  </>
                )}
                {verificationVisible &&
                  !isTestConnectionPending &&
                  verified && (
                    <>
                      <CheckCircleIcon fontSize="small" color="success" />
                      <Typography variant="caption">
                        {formatMessage('connection.testSuccessful')}
                      </Typography>
                    </>
                  )}
                {verificationVisible &&
                  !isTestConnectionPending &&
                  !verified && (
                    <>
                      <ErrorIcon fontSize="small" color="error" />
                      <Typography variant="caption">
                        {formatMessage('connection.testFailed')}
                      </Typography>
                    </>
                  )}
              </Stack>
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ display: ['none', 'inline-block'] }}
              >
                {formatMessage('connection.flowCount', {
                  count: countTranslation(
                    isConnectionFlowsLoading ? (
                      <Skeleton variant="text" width={15} />
                    ) : (
                      flowCount
                    ),
                  ),
                })}
              </Typography>
            </Box>

            <Box>
              <MoreHorizIcon ref={contextButtonRef} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      {anchorEl && (
        <ConnectionContextMenu
          appKey={key}
          connection={props.connection}
          disableReconnection={!reconnectable}
          onClose={handleClose}
          onMenuItemClick={onContextMenuAction}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}

AppConnectionRow.propTypes = {
  connection: ConnectionPropType.isRequired,
};

export default AppConnectionRow;
