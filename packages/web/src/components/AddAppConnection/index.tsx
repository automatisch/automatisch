import * as React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import useFormatMessage from 'hooks/useFormatMessage';
import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import { processStep } from 'helpers/authenticationSteps';
import InputCreator from 'components/InputCreator';
import type { IApp, IField } from '@automatisch/types';
import { Form } from './style';

type AddAppConnectionProps = {
  onClose: () => void;
  application: IApp;
  connectionId?: string;
};

type Response = {
  [key: string]: any;
}

export default function AddAppConnection(props: AddAppConnectionProps): React.ReactElement {
  const { application, connectionId, onClose } = props;
  const { key, fields, authenticationSteps, reconnectionSteps } = application;
  const formatMessage = useFormatMessage();
  const [inProgress, setInProgress] = React.useState(false);

  React.useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ source: 'automatisch', payload: window.location.search });
      window.close();
    }
  }, []);

  const submitHandler: SubmitHandler<FieldValues> = React.useCallback(async (data) => {
    setInProgress(true);
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
      const variables = computeAuthStepVariables(step.arguments, response);

      const stepResponse = await processStep(step, variables);

      response[step.name] = stepResponse;

      stepIndex++;
    }

    setInProgress(false);
    onClose?.();
  }, [connectionId, key, reconnectionSteps, authenticationSteps, onClose]);

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add connection</DialogTitle>

      <DialogContent>
        <DialogContentText tabIndex={-1} component="div">
          <Form onSubmit={submitHandler}>
            {fields?.map((field: IField) => (<InputCreator key={field.key} schema={field} />))}

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2 }}
              loading={inProgress}
            >
              {formatMessage('addAppConnection.submit')}
            </LoadingButton>
          </Form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
