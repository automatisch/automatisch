import PropTypes from 'prop-types';
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
import { useQueryClient } from '@tanstack/react-query';
import { StepPropType, SubstepPropType } from 'propTypes/propTypes';

function serializeErrors(graphQLErrors) {
  return graphQLErrors?.map((error) => {
    try {
      return {
        ...error,
        message: (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(JSON.parse(error.message), null, 2)}
          </pre>
        ),
      };
    } catch {
      return error;
    }
  });
}

function TestSubstep(props) {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onSubmit,
    onContinue,
    step,
    showWebhookUrl = false,
    flowId,
  } = props;
  const formatMessage = useFormatMessage();
  const editorContext = React.useContext(EditorContext);
  const [executeFlow, { data, error, loading, called, reset }] = useMutation(
    EXECUTE_FLOW,
    {
      context: { autoSnackbar: false },
    },
  );
  const response = data?.executeFlow?.data;
  const isCompleted = !error && called && !loading;
  const hasNoOutput = !response && isCompleted;
  const { name } = substep;
  const queryClient = useQueryClient();

  React.useEffect(
    function resetTestDataOnSubstepToggle() {
      if (!expanded) {
        reset();
      }
    },
    [expanded, reset],
  );

  const handleSubmit = React.useCallback(async () => {
    if (isCompleted) {
      onContinue?.();
      return;
    }

    await executeFlow({
      variables: {
        input: {
          stepId: step.id,
        },
      },
    });

    await queryClient.invalidateQueries({
      queryKey: ['flows', flowId],
    });
  }, [onSubmit, onContinue, isCompleted, queryClient, flowId]);

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
              {serializeErrors(error.graphQLErrors).map((error, i) => (
                <div key={i}>{error.message}</div>
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

TestSubstep.propTypes = {
  substep: SubstepPropType.isRequired,
  expanded: PropTypes.bool,
  showWebhookUrl: PropTypes.bool,
  onExpand: PropTypes.func.isRequired,
  onCollapse: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onContinue: PropTypes.func,
  step: StepPropType.isRequired,
  flowId: PropTypes.string.isRequired,
};

export default TestSubstep;
