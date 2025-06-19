import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import FlowAppIcons from 'components/FlowAppIcons';
import AdminTemplateContextMenu from 'components/AdminTemplateContextMenu';
import { Apps, CardContent, ContextMenu, Title, Typography } from './style';
import { FlowPropType } from 'propTypes/propTypes';
import useIsCurrentUserAdmin from 'hooks/useIsCurrentUserAdmin';

function TemplateItem(props) {
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const { template, to } = props;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onContextMenuClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent.stopImmediatePropagation();
    setAnchorEl(contextButtonRef.current);
  };

  return (
    <>
      <Card sx={{ mb: 1 }} data-test="template-row">
        <CardActionArea component={Link} to={to} data-test="card-action-area">
          <CardContent>
            <Apps direction="row" gap={1} sx={{ gridArea: 'apps' }}>
              <FlowAppIcons steps={template.flowData.steps} />
            </Apps>

            <Title
              justifyContent="center"
              alignItems="flex-start"
              spacing={1}
              sx={{ gridArea: 'title' }}
            >
              <Typography variant="h6" noWrap>
                {template?.name}
              </Typography>
            </Title>

            {isCurrentUserAdmin && (
              <ContextMenu>
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
            )}
          </CardContent>
        </CardActionArea>
      </Card>

      {anchorEl && (
        <AdminTemplateContextMenu
          templateId={template.id}
          onClose={handleClose}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}

TemplateItem.propTypes = {
  template: FlowPropType.isRequired,
  to: PropTypes.string.isRequired,
};

export default TemplateItem;
