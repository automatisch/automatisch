import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';

type AddAppConnectionProps = {
  onClose: (value: string) => void;
};

export default function AddAppConnection(props: AddAppConnectionProps){
  const { onClose } = props;

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add connection</DialogTitle>

      <DialogContent>
        <DialogContentText tabIndex={-1}>
          Here comes the "add connection" dialog
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
