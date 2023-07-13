import * as React from 'react';
import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import LoadingButton from '@mui/lab/LoadingButton';

import { EditorContext } from 'contexts/Editor';
import useFormatMessage from 'hooks/useFormatMessage';
import { EXECUTE_FLOW } from 'graphql/mutations/execute-flow';
import JSONViewer from 'components/JSONViewer';
import WebhookUrlInfo from 'components/WebhookUrlInfo';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import type { IStep, ISubstep } from '@automatisch/types';

type TestSubstepProps = {
  substep: ISubstep;
  expanded?: boolean;
  showWebhookUrl?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange?: ({ step }: { step: IStep }) => void;
  onSubmit?: () => void;
  onContinue?: () => void;
  step: IStep;
};

function serializeErrors(graphQLErrors: any) {
  return graphQLErrors?.map((error: Record<string, unknown>) => {
    try {
      return {
        ...error,
        message: (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(JSON.parse(error.message as string), null, 2)}
          </pre>
        ),
      };
    } catch {
      return error;
    }
  });
}

function TestSubstep(props: TestSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onSubmit,
    onContinue,
    step,
    showWebhookUrl = false,
  } = props;

  const formatMessage = useFormatMessage();
  const editorContext = React.useContext(EditorContext);
  const [executeFlow, { data, error, loading, called, reset }] = useMutation(
    EXECUTE_FLOW,
    {
      refetchQueries: ['GetStepWithTestExecutions'],
      context: { autoSnackbar: false }
    }
  );
  const response = data?.executeFlow?.data;

  const isCompleted = !error && called && !loading;
  const hasNoOutput = !response && isCompleted;

  const { name } = substep;

  React.useEffect(
    function resetTestDataOnSubstepToggle() {
      if (!expanded) {
        reset();
      }
    },
    [expanded, reset]
  );

  const handleSubmit = React.useCallback(() => {
    if (isCompleted) {
      onContinue?.();

      return;
    }

    executeFlow({
      variables: {
        input: {
          stepId: step.id,
        },
      },
    });
  }, [onSubmit, onContinue, isCompleted, step.id]);
  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle expanded={expanded} onClick={onToggle} title={name} />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {!!error?.graphQLErrors?.length && (
            <Alert
              severity="error"
              sx={{ mb: 2, fontWeight: 500, width: '100%' }}
            >
              {serializeErrors(error.graphQLErrors).map((error: any) => (
                <div>{error.message}</div>
              ))}
            </Alert>
          )}

          {step.webhookUrl && showWebhookUrl && (
            <WebhookUrlInfo webhookUrl={step.webhookUrl} sx={{ mb: 2 }} />
          )}

          {hasNoOutput && (
            <Alert severity="warning" sx={{ mb: 1, width: '100%' }}>
              <AlertTitle sx={{ fontWeight: 700 }}>
                {formatMessage('flowEditor.noTestDataTitle')}
              </AlertTitle>

              <Box sx={{ fontWeight: 400 }}>
                {formatMessage('flowEditor.noTestDataMessage')}
              </Box>
            </Alert>
          )}

          {response && (
            <Box
              sx={{ maxHeight: 400, overflowY: 'auto', width: '100%' }}
              data-test="flow-test-substep-output"
            >
              <JSONViewer data={response} />
            </Box>
          )}

          <LoadingButton
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
            loading={loading}
            disabled={editorContext.readOnly}
            color="primary"
            data-test="flow-substep-continue-button"
          >
            {isCompleted && formatMessage('flowEditor.continue')}
            {!isCompleted && formatMessage('flowEditor.testAndContinue')}
          </LoadingButton>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

export default TestSubstep;
