import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Can from 'components/Can';
import FlowFolderChangeDialog from 'components/FlowFolderChangeDialog';
import * as URLS from 'config/urls';
import useAdminDeleteTemplate from 'hooks/useAdminDeleteTemplate.ee';
import useDownloadJsonAsFile from 'hooks/useDownloadJsonAsFile';
import useDuplicateFlow from 'hooks/useDuplicateFlow';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useExportFlow from 'hooks/useExportFlow';
import useFormatMessage from 'hooks/useFormatMessage';
import useIsCurrentUserAdmin from 'hooks/useIsCurrentUserAdmin';

function AdminTemplateContextMenu(props) {
  const { templateId, onClose, anchorEl } = props;

  const [showFlowFolderChangeDialog, setShowFlowFolderChangeDialog] =
    React.useState(false);

  const navigate = useNavigate();
  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const { mutateAsync: deleteTemplate } = useAdminDeleteTemplate(templateId);

  const onTemplateDelete = React.useCallback(async () => {
    await deleteTemplate();

    enqueueSnackbar(
      formatMessage('adminTemplateContextMenu.successfullyDeleted'),
      {
        variant: 'success',
      },
    );

    onClose();
  }, [deleteTemplate, enqueueSnackbar, formatMessage, onClose]);

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <Can I="delete" a="Flow" passThrough>
        {(allowed) => (
          <MenuItem disabled={!allowed} onClick={onTemplateDelete}>
            {formatMessage('adminTemplateContextMenu.delete')}
          </MenuItem>
        )}
      </Can>
    </Menu>
  );
}

AdminTemplateContextMenu.propTypes = {
  templateId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
};

export default AdminTemplateContextMenu;
