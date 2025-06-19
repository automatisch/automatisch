import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmationDialogProps = {
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  description: React.ReactNode;
  cancelButtonChildren: React.ReactNode;
  confirmButtionChildren: React.ReactNode;
  open?: boolean;
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  const {
    onClose,
    onConfirm,
    title,
    description,
    cancelButtonChildren,
    confirmButtionChildren,
    open = true,
  } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      {title && (
        <DialogTitle>
          {title}
        </DialogTitle>
      )}
      {description && (
        <DialogContent>
          <DialogContentText>
            {description}
          </DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        {(cancelButtonChildren && onClose) && (
          <Button onClick={onClose}>{cancelButtonChildren}</Button>
        )}

        {(confirmButtionChildren && onConfirm) && (
          <Button onClick={onConfirm} color="error">
            {confirmButtionChildren}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
