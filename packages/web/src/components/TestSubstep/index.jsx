import PropTypes from 'prop-types';
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import LoadingButton from '@mui/lab/LoadingButton';

import { EditorContext } from 'contexts/Editor';
import useFormatMessage from 'hooks/useFormatMessage';
import useTestStep from 'hooks/useTestStep';
import JSONViewer from 'components/JSONViewer';
import WebhookUrlInfo from 'components/WebhookUrlInfo';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import { useQueryClient } from '@tanstack/react-query';
import { StepPropType, SubstepPropType } from 'propTypes/propTypes';
import appConfig from 'config/app.js';

const useNewFlowEditor = appConfig.useNewFlowEditor;

function TestSubstep(props) {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onContinue,
    step,
    showWebhookUrl = false,
    flowId,
  } = props;
  const formatMessage = useFormatMessage();
  const editorContext = React.useContext(EditorContext);
  const {
    mutateAsync: testStep,
    isPending: isTestStepPending,
    data,
    isSuccess: isCompleted,
    reset,
  } = useTestStep(step.id);
  const loading = isTestStepPending;
  const lastExecutionStep = data?.data.lastExecutionStep;
  const dataOut = lastExecutionStep?.dataOut;
  const errorDetails = lastExecutionStep?.errorDetails;
  const hasError = errorDetails && Object.values(errorDetails).length > 0;
  const hasNoOutput = !hasError && isCompleted && !dataOut;
  const hasOutput =
    !hasError && isCompleted && dataOut && Object.values(dataOut).length > 0;
  const { name } = substep;
  const queryClient = useQueryClient();

  React.useEffect(
    function resetTestDataOnSubstepToggle() {
      if (!expanded && !loading) {
        reset();
      }
    },
    [expanded, reset, loading],
  );

  const handleSubmit = React.useCallback(async () => {
    if (isCompleted) {
      onContinue?.();
      return;
    }

    await testStep();

    await queryClient.invalidateQueries({
      queryKey: ['flows', flowId],
    });
  }, [testStep, onContinue, isCompleted, queryClient, flowId]);

  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle expanded={expanded} onClick={onToggle} title={name} />
      <Collapse
        in={expanded}
        timeout={useNewFlowEditor ? 0 : 'auto'}
        unmountOnExit
      >
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {hasError && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            </Alert>
          )}

          {step.webhookUrl && showWebhookUrl && (
            <WebhookUrlInfo webhookUrl={step.webhookUrl} sx={{ mb: 2 }} />
          )}

          {hasNoOutput && (
            <Alert
              data-test="flow-test-substep-no-output"
              severity="warning"
              sx={{ mb: 1, width: '100%' }}
            >
              <AlertTitle>
                {formatMessage('flowEditor.noTestDataTitle')}
              </AlertTitle>

              <Box>{formatMessage('flowEditor.noTestDataMessage')}</Box>
            </Alert>
          )}

          {hasOutput && (
            <Box
              sx={{ maxHeight: 400, overflowY: 'auto', width: '100%' }}
              data-test="flow-test-substep-output"
              className="nowheel"
            >
              <JSONViewer data={dataOut} />
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
