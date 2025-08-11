import { useContext, useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEqual } from 'lodash';

import { NodesContext } from 'components/Editor/contexts';
import { StepExecutionsProvider } from 'contexts/StepExecutions';
import TestSubstep from 'components/TestSubstep';
import FlowSubstep from 'components/FlowSubstep';
import ChooseAppAndEventSubstep from 'components/ChooseAppAndEventSubstep';
import ChooseConnectionSubstep from 'components/ChooseConnectionSubstep';
import Form from 'components/Form';
import EditableTypography from 'components/EditableTypography';
import AppIcon from 'components/AppIcon';
import useApps from 'hooks/useApps';
import useTriggers from 'hooks/useTriggers';
import useActions from 'hooks/useActions';
import useTriggerSubsteps from 'hooks/useTriggerSubsteps';
import useActionSubsteps from 'hooks/useActionSubsteps';
import useStepWithTestExecutions from 'hooks/useStepWithTestExecutions';
import useFormatMessage from 'hooks/useFormatMessage';
import isEmpty from 'helpers/isEmpty';

function generateValidationSchema(substeps) {
  const fieldValidations = substeps?.reduce(
    (allValidations, { arguments: args }) => {
      if (!args || !Array.isArray(args)) return allValidations;
      const substepArgumentValidations = {};
      for (const arg of args) {
        const { key, required } = arg;
        // base validation for the field if not exists
        if (!substepArgumentValidations[key]) {
          substepArgumentValidations[key] = yup.mixed();
        }
        if (
          typeof substepArgumentValidations[key] === 'object' &&
          (arg.type === 'string' || arg.type === 'dropdown')
        ) {
          // if the field is required, add the required validation
          if (required) {
            substepArgumentValidations[key] = substepArgumentValidations[key]
              .required(`${key} is required.`)
              .test(
                'empty-check',
                `${key} must be not empty`,
                (value) => !isEmpty(value),
              );
          }
          // if the field depends on another field, add the dependsOn required validation
          if (Array.isArray(arg.dependsOn) && arg.dependsOn.length > 0) {
            for (const dependsOnKey of arg.dependsOn) {
              const missingDependencyValueMessage = `We're having trouble loading '${key}' data as required field '${dependsOnKey}' is missing.`;
              // TODO: make `dependsOnKey` agnostic to the field. However, nested validation schema is not supported.
              // So the fields under the `parameters` key are subject to their siblings only and thus, `parameters.` is removed.
              substepArgumentValidations[key] = substepArgumentValidations[
                key
              ].when(`${dependsOnKey.replace('parameters.', '')}`, {
                is: (value) => Boolean(value) === false,
                then: (schema) =>
                  schema
                    .notOneOf([''], missingDependencyValueMessage)
                    .required(missingDependencyValueMessage),
              });
            }
          }
        }
      }

      return {
        ...allValidations,
        ...substepArgumentValidations,
      };
    },
    {},
  );

  const validationSchema = yup.object({
    parameters: yup.object(fieldValidations),
  });

  return yupResolver(validationSchema);
}

function StepDetailsSidebar({ open }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const {
    steps,
    selectedStepId,
    onStepChange,
    onFlowChange,
    flowId,
    onStepSelect,
    onClearSelection,
  } = useContext(NodesContext);

  const [currentSubstep, setCurrentSubstep] = useState(0);

  const selectedStep = steps?.find((step) => step.id === selectedStepId);

  const isTrigger = selectedStep?.type === 'trigger';
  const useAppsOptions = {};

  if (isTrigger) {
    useAppsOptions.onlyWithTriggers = true;
  } else {
    useAppsOptions.onlyWithActions = true;
  }

  const { data: apps } = useApps(useAppsOptions);
  const app = apps?.data?.find(
    (currentApp) => currentApp.key === selectedStep?.appKey,
  );

  const { data: triggers } = useTriggers(app?.key);
  const { data: actions } = useActions(app?.key);
  const actionsOrTriggers = (isTrigger ? triggers?.data : actions?.data) || [];
  const actionOrTrigger = actionsOrTriggers?.find(
    ({ key }) => key === selectedStep?.key,
  );

  const { data: triggerSubsteps } = useTriggerSubsteps({
    appKey: app?.key,
    triggerKey: actionOrTrigger?.key,
  });

  const { data: actionSubsteps } = useActionSubsteps({
    appKey: app?.key,
    actionKey: actionOrTrigger?.key,
  });

  const { data: stepWithTestExecutions, refetch } = useStepWithTestExecutions(
    selectedStep?.id,
  );

  const triggerSubstepsData = triggerSubsteps?.data || [];
  const actionSubstepsData = actionSubsteps?.data || [];
  const substeps =
    triggerSubstepsData.length > 0
      ? triggerSubstepsData
      : actionSubstepsData || [];
  const stepWithTestExecutionsData = stepWithTestExecutions?.data;

  const handleChange = useCallback(
    async (changes) => {
      if (changes.step) {
        await onStepChange(changes.step);
      }
      if (changes.flow && onFlowChange) {
        onFlowChange(changes.flow);
      }
    },
    [onStepChange, onFlowChange],
  );

  const handleStepNameUpdate = useCallback(
    async (newName) => {
      if (selectedStep && newName !== selectedStep.name) {
        await onStepChange({
          ...selectedStep,
          name: newName,
        });
      }
    },
    [selectedStep, onStepChange],
  );

  const expandNextStep = useCallback(() => {
    const nextSubstepIndex = (currentSubstep ?? 0) + 1;

    // substeps do NOT include "choose app & event" substep
    if (substeps && nextSubstepIndex > substeps.length) {
      const currentStepIndex = steps?.findIndex(
        (step) => step.id === selectedStepId,
      );

      if (currentStepIndex !== -1 && currentStepIndex < steps.length - 1) {
        const nextStep = steps[currentStepIndex + 1];

        if (nextStep && onStepSelect) {
          onStepSelect(nextStep.id);
          setCurrentSubstep(0);

          return;
        }
      }
    }

    setCurrentSubstep(nextSubstepIndex);
  }, [currentSubstep, substeps, steps, selectedStepId, onStepSelect]);

  const handleSubmit = useCallback(
    (val) => {
      if (!isEqual(selectedStep, val)) {
        handleChange({ step: val });
      }
    },
    [selectedStep, handleChange],
  );

  const toggleSubstep = useCallback(
    (substepIndex) =>
      setCurrentSubstep((value) =>
        value !== substepIndex ? substepIndex : null,
      ),
    [],
  );

  const stepValidationSchema = useMemo(
    () => generateValidationSchema(substeps),
    [substeps],
  );

  useEffect(() => {
    if (selectedStep && !isTrigger) {
      refetch();
    }
  }, [selectedStep?.id, isTrigger, refetch]);

  if (!selectedStep) return;

  return (
    <Drawer
      data-test="step-details-sidebar"
      anchor="right"
      hideBackdrop
      open={open}
      variant={isMobile ? 'temporary' : 'persistent'}
      sx={{
        width: isMobile ? '100vw' : '30vw',
        maxWidth: '100vw',
        minWidth: '500px',
        '& .MuiDrawer-paper': {
          width: isMobile ? '100vw' : '30vw',
          maxWidth: '100vw',
          minWidth: '500px',
          position: 'absolute',
          height: '100%',
          right: 0,
          boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.08)',
          zIndex: 1,
        },
      }}
    >
      <Box
        p={isMobile ? 1.5 : 2}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
        display="flex"
        flexDirection="column"
        gap={1}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <AppIcon
              url={app?.iconUrl}
              name={app?.name}
              size={isMobile ? 28 : 32}
            />
            <EditableTypography
              data-test="step-name"
              variant={isMobile ? 'subtitle1' : 'h6'}
              onConfirm={handleStepNameUpdate}
              prefixValue={
                selectedStep?.position ? `${selectedStep.position}. ` : ''
              }
            >
              {selectedStep.name || actionOrTrigger?.name || 'Unnamed step'}
            </EditableTypography>
          </Box>
          <IconButton onClick={onClearSelection} size="small" sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            label={
              isTrigger
                ? formatMessage('flowStep.triggerType')
                : formatMessage('flowStep.actionType')
            }
            size="small"
            variant="outlined"
          />

          {app && (
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {app.name}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ py: 0 }}>
          <StepExecutionsProvider value={stepWithTestExecutionsData}>
            <ChooseAppAndEventSubstep
              expanded={currentSubstep === 0}
              substep={{
                key: 'chooseAppAndEvent',
                name: 'Choose app & event',
                arguments: [],
              }}
              onExpand={() => toggleSubstep(0)}
              onCollapse={() => toggleSubstep(0)}
              onSubmit={expandNextStep}
              onStepChange={onStepChange}
              onFlowChange={onFlowChange}
              step={selectedStep}
              flowId={flowId}
            />

            {actionOrTrigger &&
              substeps?.length > 0 &&
              substeps.map((substep, index) => (
                <div key={`${substep?.name}-${index}`}>
                  {substep.key === 'chooseConnection' && app && (
                    <ChooseConnectionSubstep
                      expanded={currentSubstep === index + 1}
                      substep={substep}
                      onExpand={() => toggleSubstep(index + 1)}
                      onCollapse={() => toggleSubstep(index + 1)}
                      onSubmit={expandNextStep}
                      onChange={handleChange}
                      application={app}
                      step={selectedStep}
                    />
                  )}
                  <Form
                    defaultValues={selectedStep}
                    onSubmit={handleSubmit}
                    resolver={stepValidationSchema}
                  >
                    {substep.key === 'testStep' && (
                      <TestSubstep
                        expanded={currentSubstep === index + 1}
                        substep={substep}
                        onExpand={() => toggleSubstep(index + 1)}
                        onCollapse={() => toggleSubstep(index + 1)}
                        onSubmit={expandNextStep}
                        onChange={handleChange}
                        onContinue={expandNextStep}
                        showWebhookUrl={
                          'showWebhookUrl' in actionOrTrigger
                            ? actionOrTrigger.showWebhookUrl
                            : false
                        }
                        step={selectedStep}
                        flowId={flowId}
                      />
                    )}
                    {substep.key &&
                      ['chooseConnection', 'testStep'].includes(substep.key) ===
                        false && (
                        <FlowSubstep
                          expanded={currentSubstep === index + 1}
                          substep={substep}
                          onExpand={() => toggleSubstep(index + 1)}
                          onCollapse={() => toggleSubstep(index + 1)}
                          onSubmit={expandNextStep}
                          onChange={handleChange}
                          step={selectedStep}
                          flowId={flowId}
                        />
                      )}
                  </Form>
                </div>
              ))}
          </StepExecutionsProvider>
        </List>
      </Box>
    </Drawer>
  );
}

StepDetailsSidebar.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default StepDetailsSidebar;
