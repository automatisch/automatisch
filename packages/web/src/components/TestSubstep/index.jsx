import PropTypes from 'prop-types';
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import { EditorContext } from 'contexts/Editor';
import useFormatMessage from 'hooks/useFormatMessage';
import useTestAndContinueStep from 'hooks/useTestAndContinueStep';
import useContinueWithoutTest from 'hooks/useContinueWithoutTest';
import JSONViewer from 'components/JSONViewer';
import WebhookUrlInfo from 'components/WebhookUrlInfo';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { useQueryClient } from '@tanstack/react-query';
import { StepPropType, SubstepPropType } from 'propTypes/propTypes';

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
  } = useTestAndContinueStep(step.id);
  const {
    mutateAsync: continueWithoutTest,
    isPending: isContinueWithoutTestPending,
    isSuccess: isContinueWithoutTestCompleted,
    reset: resetContinueWithoutTest,
  } = useContinueWithoutTest(step.id);
  const loading = isTestStepPending || isContinueWithoutTestPending;
  const isAnyCompleted = isCompleted || isContinueWithoutTestCompleted;
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
        resetContinueWithoutTest();
      }
    },
    [expanded, reset, resetContinueWithoutTest, loading],
  );

  const handleTestAndContinue = React.useCallback(async () => {
    if (isAnyCompleted) {
      onContinue?.();
      return;
    }

    await testStep();

    await queryClient.invalidateQueries({
      queryKey: ['flows', flowId],
    });
  }, [testStep, onContinue, isAnyCompleted, queryClient, flowId]);

  const handleContinueWithoutTest = React.useCallback(async () => {
    await continueWithoutTest();

    await queryClient.invalidateQueries({
      queryKey: ['flows', flowId],
    });

    onContinue?.();
  }, [continueWithoutTest, queryClient, flowId, onContinue]);

  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle expanded={expanded} onClick={onToggle} title={name} />
      <Collapse
        in={expanded}
        timeout={0}
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

          {!isAnyCompleted ? (
            <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleContinueWithoutTest}
                disabled={editorContext.readOnly || loading}
                sx={{ width: '30%' }}
              >
                {formatMessage('flowEditor.continue')}
              </Button>

              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleTestAndContinue}
                loading={loading}
                disabled={editorContext.readOnly}
                sx={{ width: '70%' }}
                data-test="flow-substep-continue-button"
              >
                {formatMessage('flowEditor.testAndContinue')}
              </LoadingButton>
            </Box>
          ) : (
            <LoadingButton
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => onContinue?.()}
              loading={loading}
              disabled={editorContext.readOnly}
              sx={{ mt: 1 }}
              data-test="flow-substep-continue-button"
            >
              {formatMessage('flowEditor.continue')}
            </LoadingButton>
          )}
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
