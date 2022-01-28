import * as React from 'react';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import AppIcon from 'components/AppIcon';
import { GET_APPS } from 'graphql/queries/get-apps';
import useFormatMessage from 'hooks/useFormatMessage';
import type { App } from 'types/app';
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

const optionGenerator = (app: App): { label: string; value: string; } => ({
  label: app.name,
  value: app.key,
});

const getOption = (options: Record<string, unknown>[], appKey: string) => options.find(app => app.value === appKey);

export default function FlowStep(props: FlowStepProps): React.ReactElement | null {
  const { collapsed, index, onChange } = props;
  const [step, setStep] = React.useState<Step>(props.step);
  const initialRender = React.useRef<boolean>(true);
  const formatMessage = useFormatMessage();
  const [currentSubstep, setCurrentSubstep] = React.useState<number | null>(0);
  const { data } = useQuery(GET_APPS)
  const apps: App[] = data?.getApps;

  // emit the step change to the parent component
  React.useEffect(() => {
    if (!initialRender.current) {
      onChange?.(step);
    } else {
      initialRender.current = false;
    }
  }, [step, onChange]);

  const appAndEventOptions = React.useMemo(() => apps?.map(optionGenerator), [apps]);

  const onAppAndEventChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      const typedSelectedOption = selectedOption as { value: string; };
      const option: { value: string } = typedSelectedOption;
      const appKey = option.value as string;
      setStep((step) => ({ ...step, appKey }));
    }
  }, []);

  if  (!apps) return null;

  const app = apps.find((currentApp: App) => currentApp.key === step.appKey);

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
                step.type === StepType.Trigger ?
                  formatMessage('flowStep.triggerType') :
                  formatMessage('flowStep.actionType')
              }
            </Typography>

            <Typography variant="body2">
              {index}. {app?.name}
            </Typography>
          </div>
        </Stack>
      </Header>

      {true && (
        <Collapse in={!collapsed}>
          <Content>
            <List>
              <ListItemButton onClick={() => toggleSubstep(0)}>
                Choose app & event
              </ListItemButton>
              <Collapse in={currentSubstep === 0} timeout="auto" unmountOnExit>
                <ListItem sx={{ pt: 2 }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={appAndEventOptions}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Choose app & event" />}
                    value={getOption(appAndEventOptions, step.appKey)}
                    onChange={onAppAndEventChange}
                  />
                </ListItem>
              </Collapse>
            </List>
          </Content>

          <Button onClick={onClose}>
            Close
          </Button>
        </Collapse>
      )}
    </Wrapper>
  )
};
