import { useEffect } from 'react';
import { useApolloClient } from '@apollo/client';
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

const BASE_URL = 'http://localhost:3001';

const parseData = (event: any) => {
  // Do we trust the sender of this message? (might be
  // different from what we originally opened, for example).
  if (event.origin !== BASE_URL) {
    return;
  }

  return new URLSearchParams(event.data);
};

export default function AddAppConnection(props: AddAppConnectionProps){
  const { application, onClose } = props;
  const { key, fields, authenticationSteps } = application;

  const apollo = useApolloClient();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(window.location.search);
      window.close();
    }
  });

  const submitHandler: SubmitHandler<FieldValues> = async (data) => {
    const response: Response = {
      key,
      fields: data,
    };

    for await (const authenticationStep of authenticationSteps) {
      const variables = computeAuthStepVariables(authenticationStep, response);

      if (authenticationStep.type === 'mutation') {
        const mutation = MUTATIONS[authenticationStep.name as string];

        const mutationResponse: any = await apollo.mutate({
          mutation,
          variables,
        });

        const responseData = mutationResponse.data[authenticationStep.name];
        response[authenticationStep.name] = responseData;
      }

      if (authenticationStep.type === 'openWithPopup') {
        const windowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
        const url = variables.url;

        const popup: any = window.open(url, '_blank', windowFeatures);
        popup?.focus();

        window.addEventListener('message', parseData, false);
      }
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
