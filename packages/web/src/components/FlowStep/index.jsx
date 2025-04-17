import PropTypes from 'prop-types';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isEqual } from 'lodash';

import { EditorContext } from 'contexts/Editor';
import { StepExecutionsProvider } from 'contexts/StepExecutions';
import TestSubstep from 'components/TestSubstep';
import EditableTypography from 'components/EditableTypography';
import FlowSubstep from 'components/FlowSubstep';
import ChooseAppAndEventSubstep from 'components/ChooseAppAndEventSubstep';
import ChooseConnectionSubstep from 'components/ChooseConnectionSubstep';
import Form from 'components/Form';
import FlowStepContextMenu from 'components/FlowStepContextMenu';
import AppIcon from 'components/AppIcon';

import useFormatMessage from 'hooks/useFormatMessage';
import useApps from 'hooks/useApps';
import {
  AppIconWrapper,
  AppIconStatusIconWrapper,
  Content,
  Header,
  Wrapper,
} from './style';
import isEmpty from 'helpers/isEmpty';
import { StepPropType } from 'propTypes/propTypes';
import useTriggers from 'hooks/useTriggers';
import useActions from 'hooks/useActions';
import useTriggerSubsteps from 'hooks/useTriggerSubsteps';
import useActionSubsteps from 'hooks/useActionSubsteps';
import useStepWithTestExecutions from 'hooks/useStepWithTestExecutions';
import appConfig from 'config/app.js';

const useNewFlowEditor = appConfig.useNewFlowEditor;

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

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

function FlowStep(props) {
  const { collapsed, onChange, onContinue, onDelete, flowId, step } = props;
  const editorContext = React.useContext(EditorContext);
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isTrigger = step.type === 'trigger';
  const isAction = step.type === 'action';
  const formatMessage = useFormatMessage();
  const [currentSubstep, setCurrentSubstep] = React.useState(0);
  const useAppsOptions = {};

  const stepTypeName = isTrigger
    ? formatMessage('flowStep.triggerType')
    : formatMessage('flowStep.actionType');

  if (isTrigger) {
    useAppsOptions.onlyWithTriggers = true;
  }

  if (isAction) {
    useAppsOptions.onlyWithActions = true;
  }

  const { data: apps } = useApps(useAppsOptions);

  const { data: stepWithTestExecutions, refetch } = useStepWithTestExecutions(
    step.id,
  );
  const stepWithTestExecutionsData = stepWithTestExecutions?.data;

  React.useEffect(() => {
    if (!collapsed && !isTrigger) {
      refetch(step.id);
    }
  }, [collapsed, refetch, step.id, isTrigger]);

  const app = apps?.data?.find((currentApp) => currentApp.key === step.appKey);

  const { data: triggers } = useTriggers(app?.key);

  const { data: actions } = useActions(app?.key);

  const actionsOrTriggers = (isTrigger ? triggers?.data : actions?.data) || [];

  const actionOrTrigger = actionsOrTriggers?.find(
    ({ key }) => key === step.key,
  );

  const { data: triggerSubsteps } = useTriggerSubsteps({
    appKey: app?.key,
    triggerKey: actionOrTrigger?.key,
  });

  const triggerSubstepsData = triggerSubsteps?.data || [];

  const { data: actionSubsteps } = useActionSubsteps({
    appKey: app?.key,
    actionKey: actionOrTrigger?.key,
  });

  const actionSubstepsData = actionSubsteps?.data || [];

  const substeps =
    triggerSubstepsData.length > 0
      ? triggerSubstepsData
      : actionSubstepsData || [];

  const handleChange = React.useCallback(
    async ({ step }) => {
      await onChange(step);
    },
    [onChange],
  );

  const expandNextStep = React.useCallback(() => {
    setCurrentSubstep((currentSubstep) => (currentSubstep ?? 0) + 1);
  }, []);

  const handleSubmit = (val) => {
    if (!isEqual(step, val)) {
      handleChange({ step: val });
    }
  };

  const handleStepNameChange = async (name) => {
    await onChange({
      ...step,
      name,
    });
  };

  const stepValidationSchema = React.useMemo(
    () => generateValidationSchema(substeps),
    [substeps],
  );

  if (!apps?.data) {
    return (
      <CircularProgress
        data-test="step-circular-loader"
        sx={{ display: 'block', my: 2 }}
      />
    );
  }

  const onContextMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const onContextMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(contextButtonRef.current);
  };

  const onOpen = () => collapsed && props.onOpen?.();

  const onClose = () => props.onClose?.();

  const toggleSubstep = (substepIndex) =>
    setCurrentSubstep((value) =>
      value !== substepIndex ? substepIndex : null,
    );

  const validationStatusIcon =
    step.status === 'completed' ? validIcon : errorIcon;

  return (
    <Wrapper
      elevation={collapsed ? 1 : 4}
      onClick={onOpen}
      data-test="flow-step"
    >
      <Header collapsed={collapsed}>
        <Stack direction="row" alignItems="center" gap={3}>
          <AppIconWrapper>
            <AppIcon
              url={app?.iconUrl}
              name={app?.name}
              color={app?.primaryColor}
            />

            <AppIconStatusIconWrapper>
              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <Stack direction="column" gap={0.5} sx={{ width: '100%' }}>
            <Typography
              component={Stack}
              direction="row"
              variant="stepApp"
              alignItems="center"
              gap={0.5}
            >
              <Chip label={stepTypeName} variant="stepType" size="small" />

              {app?.name}
            </Typography>

            <EditableTypography
              data-test="step-name"
              variant="body2"
              onConfirm={handleStepNameChange}
              prefixValue={`${step.position}. `}
              disabled={editorContext.readOnly || collapsed}
            >
              {step.name}
            </EditableTypography>
          </Stack>

          <Box display="flex" flex={1} justifyContent="end">
            {/* as there are no other actions besides "delete step", we hide the context menu. */}
            {!isTrigger && !editorContext.readOnly && (
              <IconButton
                color="primary"
                onClick={onContextMenuClick}
                ref={contextButtonRef}
              >
                <MoreHorizIcon />
              </IconButton>
            )}
          </Box>
        </Stack>
      </Header>

      <Collapse
        in={!collapsed}
        unmountOnExit
        timeout={useNewFlowEditor ? 0 : 'auto'}
      >
        <Content>
          <List>
            <StepExecutionsProvider value={stepWithTestExecutionsData}>
              <ChooseAppAndEventSubstep
                expanded={currentSubstep === 0}
                substep={{
                  key: 'chooAppAndEvent',
                  name: 'Choose app & event',
                  arguments: [],
                }}
                onExpand={() => toggleSubstep(0)}
                onCollapse={() => toggleSubstep(0)}
                onSubmit={expandNextStep}
                onChange={handleChange}
                step={step}
              />

              {actionOrTrigger &&
                substeps?.length > 0 &&
                substeps.map((substep, index) => (
                  <React.Fragment key={`${substep?.name}-${index}`}>
                    {substep.key === 'chooseConnection' && app && (
                      <ChooseConnectionSubstep
                        expanded={currentSubstep === index + 1}
                        substep={substep}
                        onExpand={() => toggleSubstep(index + 1)}
                        onCollapse={() => toggleSubstep(index + 1)}
                        onSubmit={expandNextStep}
                        onChange={handleChange}
                        application={app}
                        step={step}
                      />
                    )}
                    <Form
                      defaultValues={step}
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
                          onContinue={onContinue}
                          showWebhookUrl={
                            'showWebhookUrl' in actionOrTrigger
                              ? actionOrTrigger.showWebhookUrl
                              : false
                          }
                          step={step}
                          flowId={flowId}
                        />
                      )}
                      {substep.key &&
                        ['chooseConnection', 'testStep'].includes(
                          substep.key,
                        ) === false && (
                          <FlowSubstep
                            expanded={currentSubstep === index + 1}
                            substep={substep}
                            onExpand={() => toggleSubstep(index + 1)}
                            onCollapse={() => toggleSubstep(index + 1)}
                            onSubmit={expandNextStep}
                            onChange={handleChange}
                            step={step}
                            flowId={flowId}
                          />
                        )}
                    </Form>
                  </React.Fragment>
                ))}
            </StepExecutionsProvider>
          </List>
        </Content>

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </Collapse>

      {anchorEl && (
        <FlowStepContextMenu
          stepId={step.id}
          deletable={!isTrigger}
          onClose={onContextMenuClose}
          onDelete={onDelete}
          anchorEl={anchorEl}
          flowId={flowId}
        />
      )}
    </Wrapper>
  );
}

FlowStep.propTypes = {
  collapsed: PropTypes.bool,
  step: StepPropType.isRequired,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onContinue: PropTypes.func,
  onDelete: PropTypes.func,
  flowId: PropTypes.string.isRequired,
};

export default FlowStep;
