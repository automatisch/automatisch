import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';

import Can from 'components/Can';
import useAdminDeleteTemplate from 'hooks/useAdminDeleteTemplate.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

function AdminTemplateContextMenu(props) {
  const { templateId, onClose, anchorEl } = props;

  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const { mutateAsync: deleteTemplate } = useAdminDeleteTemplate(templateId);

  const onTemplateDelete = React.useCallback(async () => {
    try {
      await deleteTemplate();

      enqueueSnackbar(
        formatMessage('adminTemplateContextMenu.successfullyDeleted'),
        {
          variant: 'success',
        },
      );

      onClose();
    } catch (error) {
      enqueueSnackbar(error?.message || formatMessage('genericError'), {
        variant: 'error',
      });
    }
  }, [deleteTemplate, enqueueSnackbar, formatMessage, onClose]);

  return (
    <Menu
      open={true}
      onClose={onClose}
      hideBackdrop={false}
      anchorEl={anchorEl}
    >
      <Can I="manage" a="Flow" passThrough>
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
