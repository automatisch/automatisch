import * as React from 'react';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { DateTime } from 'luxon';

import type { IFlow } from '@automatisch/types';
import FlowAppIcons from 'components/FlowAppIcons';
import FlowContextMenu from 'components/FlowContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';
import { Apps, CardContent, ContextMenu, Title, Typography } from './style';

type FlowRowProps = {
  flow: IFlow;
};

export default function FlowRow(props: FlowRowProps): React.ReactElement {
  const formatMessage = useFormatMessage();
  const contextButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const { flow } = props;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onContextMenuClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setAnchorEl(contextButtonRef.current);
  };

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
            <Apps direction="row" gap={1} sx={{ gridArea: 'apps' }}>
              <FlowAppIcons steps={flow.steps} />
            </Apps>

            <Title
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
              sx={{ gridArea: 'title' }}
            >
              <Typography variant="h6" noWrap>
                {flow?.name}
              </Typography>

              <Typography variant="caption">
                {isUpdated &&
                  formatMessage('flow.updatedAt', {
                    datetime: relativeUpdatedAt,
                  })}
                {!isUpdated &&
                  formatMessage('flow.createdAt', {
                    datetime: relativeCreatedAt,
                  })}
              </Typography>
            </Title>

            <ContextMenu>
              <Chip
                size="small"
                color={flow?.active ? 'success' : 'info'}
                variant={flow?.active ? 'filled' : 'outlined'}
                label={formatMessage(
                  flow?.active ? 'flow.published' : 'flow.draft'
                )}
              />

              <IconButton
                size="large"
                color="inherit"
                aria-label="open context menu"
                ref={contextButtonRef}
                onClick={onContextMenuClick}
              >
                <MoreHorizIcon />
              </IconButton>
            </ContextMenu>
          </CardContent>
        </CardActionArea>
      </Card>

      {anchorEl && (
        <FlowContextMenu
          flowId={flow.id}
          onClose={handleClose}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}
