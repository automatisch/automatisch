import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import * as React from 'react';

import Can from 'components/Can';
import useDeleteForm from 'hooks/useDeleteForm.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useFormatMessage from 'hooks/useFormatMessage';

function FormContextMenu(props) {
  const { formId, onClose, anchorEl } = props;

  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const { mutateAsync: deleteForm } = useDeleteForm(formId);

  const onFlowDelete = React.useCallback(async () => {
    await deleteForm();

    enqueueSnackbar(formatMessage('formContextMenu.successfullyDeleted'), {
      variant: 'success',
    });

    onClose();
  }, [deleteForm, enqueueSnackbar, formatMessage, onClose]);

  return (
    <>
      <Menu
        open={true}
        onClose={onClose}
        hideBackdrop={false}
        anchorEl={anchorEl}
      >
        <Can I="manage" a="Flow" passThrough>
          {(allowed) => (
            <MenuItem
              data-test="delete-flow"
              disabled={!allowed}
              onClick={onFlowDelete}
            >
              {formatMessage('flow.delete')}
            </MenuItem>
          )}
        </Can>
      </Menu>
    </>
  );
}

FormContextMenu.propTypes = {
  formId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(window.Element) }),
  ]).isRequired,
};

export default FormContextMenu;
