import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

function ConfirmationDialog(props) {
  const {
    onClose,
    onConfirm,
    title,
    description,
    cancelButtonChildren,
    confirmButtonChildren,
    open = true,
    errorMessage,
  } = props;
  const dataTest = props['data-test'];
  return (
    <Dialog open={open} onClose={onClose} data-test={dataTest}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {description && (
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        {cancelButtonChildren && onClose && (
          <Button onClick={onClose} data-test="confirmation-cancel-button">
            {cancelButtonChildren}
          </Button>
        )}

        {confirmButtonChildren && onConfirm && (
          <Button
            onClick={onConfirm}
            color="error"
            data-test="confirmation-confirm-button"
          >
            {confirmButtonChildren}
          </Button>
        )}
      </DialogActions>
      {errorMessage && (
        <Alert data-test="confirmation-dialog-error-alert" severity="error">
          {errorMessage}
        </Alert>
      )}
    </Dialog>
  );
}

ConfirmationDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.node.isRequired,
  cancelButtonChildren: PropTypes.node.isRequired,
  confirmButtonChildren: PropTypes.node.isRequired,
  open: PropTypes.bool,
  'data-test': PropTypes.string,
  errorMessage: PropTypes.string,
};

export default ConfirmationDialog;
