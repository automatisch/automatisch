import * as React from 'react';
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import { GET_APPS } from 'graphql/queries/get-apps';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import type { App } from 'types/app';
import type { Step, Substep } from 'types/step';
import { StepType } from 'types/step';

type ChooseAppAndEventSubstepProps = {
  substep: Substep,
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange: ({ step }: { step: Step}) => void;
  onSubmit: () => void;
  step: Step;
};

const optionGenerator = (app: Record<string, unknown>): { label: string; value: string; } => ({
  label: app.name as string,
  value: app.key as string,
});

const getOption = (options: Record<string, unknown>[], appKey: unknown) => options.find(app => app.value === appKey as string) || null;

function ChooseAppAndEventSubstep(props: ChooseAppAndEventSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    step,
    onSubmit,
    onChange,
  } = props;

  const isTrigger = step.type === StepType.Trigger;

  const { data } = useQuery(GET_APPS, { variables: { onlyWithTriggers: isTrigger }});
  const apps: App[] = data?.getApps;
  const app = apps?.find((currentApp: App) => currentApp.key === step.appKey);

  const appOptions = React.useMemo(() => apps?.map((app) => optionGenerator(app)), [apps]);
  const actionsOrTriggers = isTrigger ? app?.triggers : app?.actions;
  const actionOptions = React.useMemo(() => actionsOrTriggers?.map((trigger) => optionGenerator(trigger)) ?? [], [app?.key]);

  const {
    name,
  } = substep;

  const valid: boolean = !!step.key && !!step.appKey;

  // placeholders
  const onEventChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      // TODO: try to simplify type casting below.
      const typedSelectedOption = selectedOption as { value: string };
      const option: { value: string } = typedSelectedOption;
      const eventKey = option?.value as string;

      if (step.key !== eventKey) {
        onChange({
          step: {
            ...step,
            key: eventKey,
          },
        });
      }
    }
  }, [step, onChange]);

  const onAppChange = React.useCallback((event: React.SyntheticEvent, selectedOption: unknown) => {
    if (typeof selectedOption === 'object') {
      // TODO: try to simplify type casting below.
      const typedSelectedOption = selectedOption as { value: string };
      const option: { value: string } = typedSelectedOption;
      const appKey = option?.value as string;

      if (step.appKey !== appKey) {
        onChange({
          step: {
            ...step,
            key: null,
            appKey,
          },
        });
      }
    }
  }, [step, onChange]);;

  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
        valid={valid}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={!valid}
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

export default ChooseAppAndEventSubstep;
