import { useMutation  } from '@apollo/client';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputCreator from 'components/InputCreator';
import { CREATE_CREDENTIALS } from 'graphql/mutations/create-credentials';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import type { App } from 'types/app';

import { Form } from './style';

type AddAppConnectionProps = {
  onClose: () => void;
  application: App;
};

export default function AddAppConnection(props: AddAppConnectionProps){
  const { application, onClose } = props;
  const { fields } = application;

  const [createCredentials, { data: newCredentials }] = useMutation(CREATE_CREDENTIALS);
  console.log('newCredentials', newCredentials)

  const submitHandler: SubmitHandler<FieldValues> = (data) => {
    const variables = {
      key: application.key,
      displayName: data.displayName,
      data: {
        consumerKey: data.consumerKey,
        consumerSecret: data.consumerSecret
      }
    };

    createCredentials({ variables });

    onClose?.();
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add connection</DialogTitle>

      <DialogContent>
        <DialogContentText tabIndex={-1} component="div">
          <Form onSubmit={submitHandler}>
            {fields?.map(field => (<InputCreator key={field.key} schema={field} />))}

            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
