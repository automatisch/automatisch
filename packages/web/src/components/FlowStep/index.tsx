import * as React from 'react';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';

import FlowSubstepTitle from 'components/FlowSubstepTitle';
import ChooseAccountSubstep from 'components/ChooseAccountSubstep';
import Form from 'components/Form';
import InputCreator from 'components/InputCreator';
import FlowStepContextMenu from 'components/FlowStepContextMenu';
import AppIcon from 'components/AppIcon';
import { GET_APPS } from 'graphql/queries/get-apps';
import useFormatMessage from 'hooks/useFormatMessage';
import type { App, AppFields } from 'types/app';
import type { Step } from 'types/step';
import { StepType } from 'types/step';
import { Content, Header, Wrapper } from './style';

type FlowStepProps = {
  collapsed?: boolean;
  step: Step;
  index?: number;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: (step: Step) => void;
}

const optionGenerator = (app: Record<string, unknown>): { label: string; value: string; } => ({
  label: app.name as string,
  value: app.key as string,
});

const getOption = (options: Record<string, unknown>[], appKey: unknown) => options.find(app => app.value === appKey as string) || null;

const parseStep = (step: any) => {
  try {
    const parameters = JSON.parse(step.parameters);
    return {
      ...step,
      parameters,
    }
  } catch (err) {
    // highly likely that step does not have any parameters and thus, the error is thrown
    return step;
  }
};

const validateSubstep = (substep: any, step: Step, substepIndex: number, substepCount: number) => {
  if (!substep) return true;

  if (substepCount < substepIndex + 1) {
    return null;
  }

  if (substep.name === 'Choose account') {
    return Boolean(step.connection?.id);
  }

  const args: AppFields[] = substep.arguments || [];

  return args.every(arg => {
    if (arg.required === false) { return true; }

    const argValue = step.parameters[arg.key];

    return argValue !== null && argValue !== undefined;
  });
};

export default function FlowStep(props: FlowStepProps): React.ReactElement | null {
  const { collapsed, index, onChange } = props;
  const contextButtonRef = React.useRef<HTMLButtonElement  | null>(null);
  const [step, setStep] = React.useState<Step>(() => parseStep(props.step));
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement  | null>(null);
  const isTrigger = step.type === StepType.Trigger;
  const isAction = step.type === StepType.Action;
  const initialRender = React.useRef<boolean>(true);
  const formatMessage = useFormatMessage();
  const [currentSubstep, setCurrentSubstep] = React.useState<number | null>(0);
  const { data } = useQuery(GET_APPS, { variables: { onlyWithTriggers: isTrigger }});
  const apps: App[] = data?.getApps;
  const app = apps?.find((currentApp: App) => currentApp.key === step.appKey);

  // emit the step change to the parent component
  React.useEffect(() => {
    if (!initialRender.current) {
      onChange?.(step);
    } else {
      initialRender.current = false;
    }
  }, [step, onChange]);

  const appOptions = React.useMemo(() => apps?.map((app) => optionGenerator(app)), [apps]);
  const actionsOrTriggers = isTrigger ? app?.triggers : app?.actions;
  const actionOptions = React.useMemo(() => actionsOrTriggers?.map((trigger) => optionGenerator(trigger)) ?? [], [app?.key]);
  const substeps = React.useMemo(() => actionsOrTriggers?.find(({ key }) => key === step.key)?.subSteps || [], [actionsOrTriggers, step?.key]);
  const substepCount = substeps.length + 1;

  const expandNextStep = React.useCallback(() => { setCurrentSubstep((currentSubstep) => (currentSubstep ?? 0) + 1); }, []);

  const onAppChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      const typedSelectedOption = selectedOption as { value: string; };
      const option: { value: string } = typedSelectedOption;
      const appKey = option?.value as string;
      setStep((step) => ({ ...step, appKey, parameters: {} }));
    }
  }, []);

  const onEventChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      const typedSelectedOption = selectedOption as { value: string; };
      const option: { value: string } = typedSelectedOption;
      const eventKey = option?.value as string;
      setStep((step) => ({
        ...step,
        key: eventKey,
        parameters: {},
      }));

      expandNextStep();
    }
  }, []);

  const onAccountChange = React.useCallback((connectionId: string) => {
    setStep((step) => ({
      ...step,
      connection: {
        id: connectionId,
      },
    }));

    expandNextStep();
  }, []);

  const onParameterChange = React.useCallback((event: React.SyntheticEvent) => {
    const { name, value } = event.target as HTMLInputElement;

    setStep((step) => ({
      ...step,
      parameters: {
        ...step.parameters,
        [name]: value
      }
    }));
  }, []);

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

  return (
    <Wrapper elevation={collapsed ? 1 : 4} onClick={onOpen}>
      <Header collapsed={collapsed}>
        <Stack direction="row" alignItems="center" gap={2}>
          <AppIcon url={app?.iconUrl} name={app?.name} />

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

      <Collapse in={!collapsed}>
        <Content>
          <List>
            <FlowSubstepTitle
              expanded={currentSubstep === 0}
              onClick={() => toggleSubstep(0)}
              title="Choose app & event"
              valid={substepCount === 1 ? null : !!step.appKey && !!step.key}
            />
            <Collapse in={currentSubstep === 0} timeout="auto" unmountOnExit>
              <ListItem sx={{ pt: 2, pb: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  disableClearable
                  options={appOptions}
                  renderInput={(params) => <TextField {...params} label="Choose an app" />}
                  value={getOption(appOptions, step.appKey)}
                  onChange={onAppChange}
                />

                {step.appKey && (
                  <Box display="flex" width="100%" pt={2} flexDirection="column">
                    <Typography variant="subtitle2" pb={2} gutterBottom>
                      Action event
                    </Typography>

                    <Autocomplete
                      fullWidth
                      disablePortal
                      disableClearable
                      options={actionOptions}
                      renderInput={(params) => <TextField {...params} label="Choose an event" />}
                      value={getOption(actionOptions, step.key)}
                      onChange={onEventChange}
                    />
                  </Box>
                )}
              </ListItem>
            </Collapse>

            <Form defaultValues={step.parameters}>
              {substeps?.length > 0 && substeps.map((substep: { name: string, arguments: AppFields[] }, index: number) => (
                <React.Fragment key={`${substep?.name}-${index}`}>
                  {validateSubstep(substeps[index - 1], step, index, substepCount) && (
                    <React.Fragment>
                      <FlowSubstepTitle
                        expanded={currentSubstep === (index + 1)}
                        onClick={() => toggleSubstep(index + 1)}
                        title={substep.name}
                        valid={validateSubstep(substep, step, index + 1, substepCount)}
                      />
                      <Collapse in={currentSubstep === (index + 1)} timeout="auto" unmountOnExit>
                        <ListItem sx={{ pt: 2, pb: 3 }}>
                          {substep.name === 'Choose account' && (
                            <ChooseAccountSubstep
                              appKey={step.appKey}
                              connectionId={step.connection?.id as string}
                              onChange={onAccountChange}
                            />
                          )}

                          {substep.name !== 'Choose account' && (
                            <React.Fragment>
                              {substep?.arguments?.map((argument: AppFields) => (
                                <InputCreator key={argument?.key} schema={argument} onBlur={onParameterChange} />
                              ))}
                            </React.Fragment>
                          )}
                        </ListItem>
                      </Collapse>
                    </React.Fragment>
                  )}
                </React.Fragment>
              ))}
            </Form>
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
