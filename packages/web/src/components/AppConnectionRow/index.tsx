import { useLazyQuery, useMutation } from '@apollo/client';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import { DateTime } from 'luxon';
import * as React from 'react';

import type { IConnection } from '@automatisch/types';
import ConnectionContextMenu from 'components/AppConnectionContextMenu';
import { DELETE_CONNECTION } from 'graphql/mutations/delete-connection';
import { TEST_CONNECTION } from 'graphql/queries/test-connection';
import useFormatMessage from 'hooks/useFormatMessage';
import { CardContent, Typography } from './style';

type AppConnectionRowProps = {
  connection: IConnection;
};

const countTranslation = (value: React.ReactNode) => (
  <>
    <Typography variant="body1">{value}</Typography>
    <br />
  </>
);

function AppConnectionRow(props: AppConnectionRowProps): React.ReactElement {
  const enqueueSnackbar = useEnqueueSnackbar();
  const [verificationVisible, setVerificationVisible] = React.useState(false);
  const [testConnection, { called: testCalled, loading: testLoading }] =
    useLazyQuery(TEST_CONNECTION, {
      fetchPolicy: 'network-only',
      onCompleted: () => {
        setTimeout(() => setVerificationVisible(false), 3000);
      },
      onError: () => {
        setTimeout(() => setVerificationVisible(false), 3000);
      },
    });
  const [deleteConnection] = useMutation(DELETE_CONNECTION);

  const formatMessage = useFormatMessage();
  const {
    id,
    key,
    formattedData,
    verified,
    createdAt,
    flowCount,
    reconnectable,
  } = props.connection;

  const contextButtonRef = React.useRef<SVGSVGElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onContextMenuClick = () => setAnchorEl(contextButtonRef.current);
  const onContextMenuAction = React.useCallback(
    async (event, action: { [key: string]: string }) => {
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

        enqueueSnackbar(formatMessage('connection.deletedMessage'), {
          variant: 'success',
          SnackbarProps: {
            'data-test': 'snackbar-delete-connection-success'
          }
        });
      } else if (action.type === 'test') {
        setVerificationVisible(true);
        testConnection({ variables: { id } });
      }
    },
    [deleteConnection, id, testConnection, formatMessage, enqueueSnackbar]
  );

  const relativeCreatedAt = DateTime.fromMillis(
    parseInt(createdAt, 10)
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
                {verificationVisible && testCalled && testLoading && (
                  <>
                    <CircularProgress size={16} />
                    <Typography variant="caption">
                      {formatMessage('connection.testing')}
                    </Typography>
                  </>
                )}
                {verificationVisible && testCalled && !testLoading && verified && (
                  <>
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="caption">
                      {formatMessage('connection.testSuccessful')}
                    </Typography>
                  </>
                )}
                {verificationVisible &&
                  testCalled &&
                  !testLoading &&
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
                  count: countTranslation(flowCount),
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

export default AppConnectionRow;
