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
import IconButton from '@mui/material/IconButton';

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

const getOption = (options: Record<string, unknown>[], appKey: unknown) => options.find(app => app.value === appKey as string);

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
  const { data } = useQuery(GET_APPS)
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

  const appAndEventOptions = React.useMemo(() => apps?.map((app) => optionGenerator(app)), [apps]);
  const actionsOrTriggers = isTrigger ? app?.triggers : app?.actions;
  const actionOptions = React.useMemo(() => actionsOrTriggers?.map((trigger) => optionGenerator(trigger)) ?? [], [app?.key]);
  const substeps = React.useMemo(() => actionsOrTriggers?.find(({ key }) => key === step.key)?.subSteps, [actionsOrTriggers, step?.key]);

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
    }
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
            <ListItemButton onClick={() => toggleSubstep(0)} selected={currentSubstep === 0} divider>
              <Typography variant="body2">
                Choose app & event
              </Typography>
            </ListItemButton>
            <Collapse in={currentSubstep === 0} timeout="auto" unmountOnExit>
              <ListItem sx={{ pt: 2, flexDirection: 'column', alignItems: 'flex-start' }}>
                <Autocomplete
                  fullWidth
                  disablePortal
                  options={appAndEventOptions}
                  renderInput={(params) => <TextField {...params} label="Choose app" />}
                  value={getOption(appAndEventOptions, step.appKey)}
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
                  <ListItemButton onClick={() => toggleSubstep(index + 1)} selected={currentSubstep === (index + 1)} divider>
                    <Typography variant="body2">
                      {substep.name as string}
                    </Typography>
                  </ListItemButton>
                  <Collapse in={currentSubstep === (index + 1)} timeout="auto" unmountOnExit>
                    <ListItem sx={{ pt: 2 }}>
                      {substep?.arguments?.map((argument: AppFields) => (
                        <InputCreator key={argument?.key} schema={argument} onBlur={onParameterChange} />
                      ))}
                    </ListItem>
                  </Collapse>
                </React.Fragment>
              ))}
            </Form>
          </List>
        </Content>

        <Button onClick={onClose}>
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
