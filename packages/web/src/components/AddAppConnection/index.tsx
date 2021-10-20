import { useCallback, useEffect } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import { processStep } from 'helpers/authenticationSteps';
import InputCreator from 'components/InputCreator';
import type { App } from 'types/app';
import { Form } from './style';

type AddAppConnectionProps = {
  onClose: () => void;
  application: App;
  connectionId?: string;
};

type Response = {
  [key: string]: any;
}

export default function AddAppConnection(props: AddAppConnectionProps){
  const { application, connectionId, onClose } = props;
  const { key, fields, authenticationSteps, reconnectionSteps } = application;

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ source: 'automatisch', payload: window.location.search });
      window.close();
    }
  }, []);

  const submitHandler: SubmitHandler<FieldValues> = useCallback(async (data) => {
    const hasConnection = Boolean(connectionId);

    const response: Response = {
      key,
      connection: {
        id: connectionId
      },
      fields: data,
    };

    const steps = hasConnection ? reconnectionSteps : authenticationSteps;

    let stepIndex = 0;
    while (stepIndex < steps.length) {
      const step = steps[stepIndex];
      const variables = computeAuthStepVariables(step, response);

      const stepResponse = await processStep(step, variables);

      response[step.name] = stepResponse;

      stepIndex++;
    }

    onClose?.();
  }, [connectionId, key, reconnectionSteps, authenticationSteps, onClose]);

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
