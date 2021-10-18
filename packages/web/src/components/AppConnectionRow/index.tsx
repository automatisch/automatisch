import * as React from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { DELETE_CONNECTION } from 'graphql/mutations/delete-connection';
import { TEST_CONNECTION } from 'graphql/queries/test-connection';
import ConnectionContextMenu from 'components/AppConnectionContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import type { Connection } from 'types/connection';
import { CardContent, Typography } from './style';

type AppConnectionRowProps = {
  connection: Connection;
}

const countTranslation = (value: React.ReactNode) => (<><strong>{value}</strong><br /></>);

function AppConnectionRow(props: AppConnectionRowProps) {
  const [testConnection, { data: testData, called: testCalled, loading: testLoading }] = useLazyQuery(TEST_CONNECTION);
  const [deleteConnection] = useMutation(DELETE_CONNECTION);

  const formatMessage = useFormatMessage();
  const { id, key, data } = props.connection;

  const contextButtonRef = React.useRef<SVGSVGElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onContextMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(contextButtonRef.current);
  const onContextMenuAction = React.useCallback((event, action: { [key: string]: string }) => {
    if (action.type === 'delete') {
      deleteConnection({
        variables: { id },
        update: (cache, mutationResult) => {
          const connectionCacheId = cache.identify({
            __typename: 'connection',
            id,
          });

          cache.evict({
            id: connectionCacheId,
          });
        }
      });
    } else if (action.type === 'test') {
      testConnection({ variables: { id } });
    }
  }, [deleteConnection, id, testConnection]);

  return (
    <>
      <Card sx={{ my: 2 }}>
        <CardActionArea onClick={onContextMenuClick}>
          <CardContent>
            <Box>
              <Typography variant="h6">
                {data.screenName}
              </Typography>
            </Box>

            <Box>
              {testCalled && !testLoading && (testData ? 'yes' : 'no')}
            </Box>

            <Box sx={{ px: 2 }}>
              <Typography variant="body2">
                {formatMessage('connection.flowCount', { count: countTranslation(0) })}
              </Typography>
            </Box>

            <Box>
              <MoreHorizIcon ref={contextButtonRef} />
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      {anchorEl && <ConnectionContextMenu
        appKey={key}
        onClose={handleClose}
        onMenuItemClick={onContextMenuAction}
        anchorEl={anchorEl}
      />}
    </>
  );
}

export default AppConnectionRow;
