import { useApolloClient, useMutation  } from '@apollo/client';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import InputCreator from 'components/InputCreator';
import MUTATIONS from 'graphql/mutations';
import type { App } from 'types/app';
import { Form } from './style';

type AddAppConnectionProps = {
  onClose: () => void;
  application: App;
};

type Response = {
  [key: string]: any;
}

export default function AddAppConnection(props: AddAppConnectionProps){
  const { application, onClose } = props;
  const { key, fields, authenticationSteps } = application;

  const apollo = useApolloClient();

  const submitHandler: SubmitHandler<FieldValues> = async (data) => {
    const response: Response = {
      key,
      fields: data,
    };

    for await (const authenticationStep of authenticationSteps) {
      const mutation = MUTATIONS[authenticationStep.name as string];
      const variables = computeAuthStepVariables(authenticationStep, response);

      const mutationResponse: any = await apollo.mutate({
        mutation,
        variables,
      });

      response[authenticationStep.name] = mutationResponse.data[authenticationStep.name];
    }
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
