import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';

import { DateTime } from 'luxon';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import AgentContextMenu from 'components/AgentContextMenu/index.ee';
import { CardContent, ContextMenu, Title, Typography } from './style.ee';

function AgentRow(props) {
  const formatMessage = useFormatMessage();
  const { agent } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const createdAt = DateTime.fromMillis(parseInt(agent.createdAt, 10));
  const updatedAt = DateTime.fromMillis(parseInt(agent.updatedAt, 10));
  const isUpdated = updatedAt > createdAt;
  const relativeCreatedAt = createdAt.toRelative();
  const relativeUpdatedAt = updatedAt.toRelative();

  const handleContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ mb: 1 }} data-test="agent-row">
      <CardActionArea
        component={Link}
        to={URLS.AGENT(agent.id)}
        data-test="card-action-area"
        state={{
          from: `${location.pathname}${location.search}${location.hash}`,
        }}
      >
        <CardContent>
          <Title
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
            sx={{ gridArea: 'title' }}
          >
            <Typography variant="h6" noWrap>
              {agent?.name || formatMessage('agent.untitled')}
            </Typography>

            {agent?.description && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {agent.description}
              </Typography>
            )}

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
            <IconButton
              size="large"
              color="inherit"
              aria-label="open context menu"
              onClick={handleContextMenuClick}
            >
              <MoreHorizIcon />
            </IconButton>
          </ContextMenu>
        </CardContent>
      </CardActionArea>

      {anchorEl && (
        <AgentContextMenu
          agentId={agent.id}
          anchorEl={anchorEl}
          onClose={handleContextMenuClose}
        />
      )}
    </Card>
  );
}

AgentRow.propTypes = {
  agent: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    description: PropTypes.string,
    createdAt: PropTypes.number.isRequired,
    updatedAt: PropTypes.number.isRequired,
  }).isRequired,
};

export default AgentRow;
