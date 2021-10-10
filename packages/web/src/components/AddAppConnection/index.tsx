import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import type { App } from 'types/app';

type AddAppConnectionProps = {
  onClose: (value: string) => void;
  application: App;
};

export default function AddAppConnection(props: AddAppConnectionProps){
  const { application, onClose } = props;
  const { name } = application;

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add connection</DialogTitle>

      <DialogContent>
        <DialogContentText tabIndex={-1}>
          Add a connection to {name}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
