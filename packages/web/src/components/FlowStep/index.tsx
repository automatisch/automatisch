import * as React from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { IApp, IField, IStep } from '@automatisch/types';

import { StepExecutionsProvider } from 'contexts/StepExecutions';
import TestSubstep from 'components/TestSubstep';
import FlowSubstep from 'components/FlowSubstep';
import ChooseAppAndEventSubstep from 'components/ChooseAppAndEventSubstep';
import ChooseAccountSubstep from 'components/ChooseAccountSubstep';
import Form from 'components/Form';
import FlowStepContextMenu from 'components/FlowStepContextMenu';
import AppIcon from 'components/AppIcon';
import { GET_APPS } from 'graphql/queries/get-apps';
import { GET_STEP_WITH_TEST_EXECUTIONS } from 'graphql/queries/get-step-with-test-executions';
import useFormatMessage from 'hooks/useFormatMessage';
import { AppIconWrapper, AppIconStatusIconWrapper, Content, Header, Wrapper } from './style';

type FlowStepProps = {
  collapsed?: boolean;
  step: IStep;
  index?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onChange: (step: IStep) => void;
}

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

export default function FlowStep(props: FlowStepProps): React.ReactElement | null {
  const { collapsed, index, onChange } = props;
  const contextButtonRef = React.useRef<HTMLButtonElement  | null>(null);
  const step: IStep = props.step;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement  | null>(null);
  const isTrigger = step.type === 'trigger';
  const formatMessage = useFormatMessage();
  const [currentSubstep, setCurrentSubstep] = React.useState<number | null>(2);
  const { data } = useQuery(GET_APPS, { variables: { onlyWithTriggers: isTrigger }});
  const [
    getStepWithTestExecutions,
    {
      data: stepWithTestExecutionsData,
      called: stepWithTestExecutionsCalled,
      loading: stepWithTestExecutionsLoading,
      error: stepWithTestExecutionsError
    },
  ] = useLazyQuery(GET_STEP_WITH_TEST_EXECUTIONS, {
    fetchPolicy: 'network-only',
  });

  React.useEffect(() => {
    if (!stepWithTestExecutionsCalled && !collapsed && !isTrigger) {
      getStepWithTestExecutions({
        variables: {
          stepId: step.id,
        },
      });
    }
  }, [collapsed, stepWithTestExecutionsCalled, getStepWithTestExecutions, step.id, isTrigger]);

  const apps: IApp[] = data?.getApps;
  const app = apps?.find((currentApp: IApp) => currentApp.key === step.appKey);

  const actionsOrTriggers = isTrigger ? app?.triggers : app?.actions;
  const substeps = React.useMemo(() => actionsOrTriggers?.find(({ key }) => key === step.key)?.subSteps || [], [actionsOrTriggers, step?.key]);

  const handleChange = React.useCallback(({ step }: { step: IStep }) => {
    onChange(step);
  }, [])

  const expandNextStep = React.useCallback(() => {
    setCurrentSubstep((currentSubstep) => (currentSubstep ?? 0) + 1);
  }, []);

  const handleSubmit = (val: any) => {
    handleChange({ step: val as IStep });
  }

  if  (!apps) return null;

  const onContextMenuClose = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
  }
  const onContextMenuClick = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    setAnchorEl(contextButtonRef.current);
  }
  const onOpen = () => collapsed && props.onOpen?.();
  const onClose = () => props.onClose?.();

  const toggleSubstep = (substepIndex: number) => setCurrentSubstep((value) => value !== substepIndex ? substepIndex : null);

  const validationStatusIcon = step.status === 'completed' ? validIcon : errorIcon;

  return (
    <Wrapper elevation={collapsed ? 1 : 4} onClick={onOpen}>
      <Header collapsed={collapsed}>
        <Stack direction="row" alignItems="center" gap={2}>
          <AppIconWrapper>
            <AppIcon url={app?.iconUrl} name={app?.name} />

            <AppIconStatusIconWrapper>
              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <div>
            <Typography variant="caption">
              {
                isTrigger ?
                  formatMessage('flowStep.triggerType') :
                  formatMessage('flowStep.actionType')
              }
            </Typography>

            <Typography variant="body2">
              {index}. {app?.name}
            </Typography>
          </div>

          <Box display="flex" flex={1} justifyContent="end">
            {/* as there are no other actions besides "delete step", we hide the context menu. */}
            {!isTrigger && <IconButton color="primary" onClick={onContextMenuClick} ref={contextButtonRef}>
              <MoreHorizIcon />
            </IconButton>}
          </Box>
        </Stack>
      </Header>

      <Collapse in={!collapsed} unmountOnExit>
        <Content>
          <List>
            <StepExecutionsProvider value={stepWithTestExecutionsData?.getStepWithTestExecutions as IStep[]}>
              <Form defaultValues={step} onSubmit={handleSubmit}>
                <ChooseAppAndEventSubstep
                  expanded={currentSubstep === 0}
                  substep={{ name: 'Choose app & event', arguments: [] }}
                  onExpand={() => toggleSubstep(0)}
                  onCollapse={() => toggleSubstep(0)}
                  onSubmit={expandNextStep}
                  onChange={handleChange}
                  step={step}
                />

                {substeps?.length > 0 && substeps.map((substep: { name: string, key: string, arguments: IField[] }, index: number) => (
                  <React.Fragment key={`${substep?.name}-${index}`}>
                    {substep.key === 'chooseAccount' && (
                      <ChooseAccountSubstep
                        expanded={currentSubstep === (index + 1)}
                        substep={substep}
                        onExpand={() => toggleSubstep((index + 1))}
                        onCollapse={() => toggleSubstep((index + 1))}
                        onSubmit={expandNextStep}
                        onChange={handleChange}
                        step={step}
                      />
                    )}

                    {substep.key === 'testStep' && (
                      <TestSubstep
                        expanded={currentSubstep === (index + 1)}
                        substep={substep}
                        onExpand={() => toggleSubstep((index + 1))}
                        onCollapse={() => toggleSubstep((index + 1))}
                        onSubmit={expandNextStep}
                        onChange={handleChange}
                        step={step}
                      />
                    )}

                    {['chooseAccount', 'testStep'].includes(substep.key) === false && (
                      <FlowSubstep
                        expanded={currentSubstep === (index + 1)}
                        substep={substep}
                        onExpand={() => toggleSubstep((index + 1))}
                        onCollapse={() => toggleSubstep((index + 1))}
                        onSubmit={expandNextStep}
                        onChange={handleChange}
                        step={step}
                      />
                    )}
                  </React.Fragment>
                ))}
              </Form>
            </StepExecutionsProvider>
          </List>
        </Content>

        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </Collapse>

      {anchorEl && <FlowStepContextMenu
        stepId={step.id}
        deletable={!isTrigger}
        onClose={onContextMenuClose}
        anchorEl={anchorEl}
      />}
    </Wrapper>
  )
};
