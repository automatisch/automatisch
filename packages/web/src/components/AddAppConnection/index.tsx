import { useCallback, useEffect } from 'react';
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
  const searchParams = new URLSearchParams(event.data);

  return getObjectOfEntries(searchParams.entries());
};

function getObjectOfEntries(iterator: any) {
  const result: any = {};

  for (const [key, value] of iterator) {
    result[key] = value;
  }

  return result;
}

function* authStepGenerator(steps: any[]) {
  for (const step of steps) {
    yield step;
  }

  return;
}

export default function AddAppConnection(props: AddAppConnectionProps){
  const { application, onClose } = props;
  const { key, fields, authenticationSteps } = application;

  const apollo = useApolloClient();

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ source: 'automatisch', payload: window.location.search });
      window.close();
    }
  }, []);

  const submitHandler: SubmitHandler<FieldValues> = useCallback(async (data) => {
    const response: Response = {
      key,
      fields: data,
    };

    const stepGenerator = authStepGenerator(authenticationSteps);

    const processStep = async (step: any) => {
      const variables = computeAuthStepVariables(step, response);

      if (step.type === 'mutation') {
        const mutation = MUTATIONS[step.name];
        const mutationResponse = await apollo.mutate({ mutation, variables });
        const responseData = mutationResponse.data[step.name];

        response[step.name] = responseData;

        const nextStep = stepGenerator.next();

        if (!nextStep.done) {
          await processStep(nextStep.value);
        }
      } else if (step.type === 'openWithPopup') {
        const windowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
        const url = variables.url;

        const popup: any = window.open(url, '_blank', windowFeatures);
        popup?.focus();

        const messageHandler = async (event: any) => {
          // check origin and data.source to trust the event
          if (event.origin !== BASE_URL || event.data.source !== 'automatisch') {
            return;
          }

          const data = parseData(event);
          response[step.name] = data;

          const nextStep = stepGenerator.next();
          if (!nextStep.done) {
            await processStep(nextStep.value);
          }

          window.removeEventListener('message', messageHandler);
        };

        window.addEventListener('message', messageHandler, false);
      }
    }

    const firstStep = stepGenerator.next();

    if (!firstStep.done) {
      await processStep(firstStep.value);
    }

  }, [apollo, authenticationSteps, key]);

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
