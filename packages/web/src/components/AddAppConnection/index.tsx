import * as React from 'react';
import Alert from '@mui/material/Alert';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import type { IApp, IJSONObject, IField } from '@automatisch/types';

import useFormatMessage from 'hooks/useFormatMessage';
import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import { processStep } from 'helpers/authenticationSteps';
import InputCreator from 'components/InputCreator';
import { generateExternalLink } from '../../helpers/translation-values';
import { Form } from './style';

type AddAppConnectionProps = {
  onClose: (response: Record<string, unknown>) => void;
  application: IApp;
  connectionId?: string;
};

type Response = {
  [key: string]: any;
};

export default function AddAppConnection(
  props: AddAppConnectionProps
): React.ReactElement {
  const { application, connectionId, onClose } = props;
  const { name, authDocUrl, key, auth } = application;
  const formatMessage = useFormatMessage();
  const [error, setError] = React.useState<IJSONObject | null>(null);
  const [inProgress, setInProgress] = React.useState(false);
  const hasConnection = Boolean(connectionId);
  const steps = hasConnection
    ? auth?.reconnectionSteps
    : auth?.authenticationSteps;

  React.useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({
        source: 'automatisch',
        payload: window.location.search,
      });
      window.close();
    }
  }, []);

  const submitHandler: SubmitHandler<FieldValues> = React.useCallback(
    async (data) => {
      if (!steps) return;

      setInProgress(true);
      setError(null);

      const response: Response = {
        key,
        connection: {
          id: connectionId,
        },
        fields: data,
      };

      let stepIndex = 0;
      while (stepIndex < steps.length) {
        const step = steps[stepIndex];
        const variables = computeAuthStepVariables(step.arguments, response);

        try {
          const stepResponse = await processStep(step, variables);

          response[step.name] = stepResponse;
        } catch (err) {
          const error = err as IJSONObject;
          console.log(error);
          setError((error.graphQLErrors as IJSONObject[])?.[0]);
          setInProgress(false);

          break;
        }

        stepIndex++;

        if (stepIndex === steps.length) {
          onClose(response);
        }
      }

      setInProgress(false);
    },
    [connectionId, key, steps, onClose]
  );

  return (
    <Dialog open={true} onClose={onClose} data-test="add-app-connection-dialog">
      <DialogTitle>
        {hasConnection
          ? formatMessage('app.reconnectConnection')
          : formatMessage('app.addConnection')}
      </DialogTitle>

      {authDocUrl && (
        <Alert severity="info" sx={{ fontWeight: 300 }}>
          {formatMessage('addAppConnection.callToDocs', {
            appName: name,
            docsLink: generateExternalLink(authDocUrl),
          })}
        </Alert>
      )}

      {error && (
        <Alert
          severity="error"
          sx={{ mt: 1, fontWeight: 500, wordBreak: 'break-all' }}
        >
          {error.message}
          <pre>{JSON.stringify(error.details, null, 2)}</pre>
        </Alert>
      )}

      <DialogContent>
        <DialogContentText tabIndex={-1} component="div">
          <Form onSubmit={submitHandler}>
            {auth?.fields?.map((field: IField) => (
              <InputCreator key={field.key} schema={field} />
            ))}

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2 }}
              loading={inProgress}
              data-test="create-connection-button"
            >
              {formatMessage('addAppConnection.submit')}
            </LoadingButton>
          </Form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
