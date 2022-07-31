import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DateTime } from 'luxon';

import type { IFlow } from '@automatisch/types';
import FlowContextMenu from 'components/FlowContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import { CardContent, Typography } from './style';

type FlowRowProps = {
  flow: IFlow;
}

export default function FlowRow(props: FlowRowProps): React.ReactElement {
  const formatMessage = useFormatMessage();
  const contextButtonRef = React.useRef<HTMLButtonElement  | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement  | null>(null);
  const { flow } = props;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onContextMenuClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setAnchorEl(contextButtonRef.current);
  }

  const createdAt = DateTime.fromMillis(parseInt(flow.createdAt, 10));
  const updatedAt = DateTime.fromMillis(parseInt(flow.updatedAt, 10));
  const isUpdated = updatedAt > createdAt;
  const relativeCreatedAt = createdAt.toRelative();
  const relativeUpdatedAt = updatedAt.toRelative();

  return (
    <>
      <Card sx={{ mb: 1 }}>
        <CardActionArea component={Link} to={URLS.FLOW(flow.id)}>
          <CardContent>
            <Stack
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
            >
              <Typography variant="h6" noWrap>
                {flow?.name}
              </Typography>

              <Typography variant="caption">
                {isUpdated && formatMessage('flow.updatedAt', { datetime: relativeUpdatedAt })}
                {!isUpdated && formatMessage('flow.createdAt', { datetime: relativeCreatedAt })}
              </Typography>
            </Stack>

            <Box>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open context menu"
                ref={contextButtonRef}
                onClick={onContextMenuClick}
              >
                <MoreHorizIcon />
              </IconButton>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>

      {anchorEl && <FlowContextMenu
        flowId={flow.id}
        onClose={handleClose}
        anchorEl={anchorEl}
      />}
    </>
  );
}