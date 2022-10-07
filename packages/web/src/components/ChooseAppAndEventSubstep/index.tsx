import * as React from 'react';
import { useQuery } from '@apollo/client';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import useFormatMessage from 'hooks/useFormatMessage';
import { EditorContext } from 'contexts/Editor';
import { GET_APPS } from 'graphql/queries/get-apps';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import type { IApp, IStep, ISubstep, ITrigger, IAction } from '@automatisch/types';

type ChooseAppAndEventSubstepProps = {
  substep: ISubstep;
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange: ({ step }: { step: IStep }) => void;
  onSubmit: () => void;
  step: IStep;
};

const optionGenerator = (app: { name: string, key: string, }): { label: string; value: string } => ({
  label: app.name as string,
  value: app.key as string,
});

const getOption = (options: Record<string, unknown>[], appKey?: IApp['key']) =>
  options.find((option) => option.value === (appKey as string)) || null;

function ChooseAppAndEventSubstep(
  props: ChooseAppAndEventSubstepProps
): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    step,
    onSubmit,
    onChange,
  } = props;

  const formatMessage = useFormatMessage();
  const editorContext = React.useContext(EditorContext);

  const isTrigger = step.type === 'trigger';

  const { data } = useQuery(GET_APPS, {
    variables: { onlyWithTriggers: isTrigger },
  });
  const apps: IApp[] = data?.getApps;
  const app = apps?.find((currentApp: IApp) => currentApp.key === step.appKey);

  const appOptions = React.useMemo(
    () => apps?.map((app) => optionGenerator(app)),
    [apps]
  );
  const actionsOrTriggers: Array<ITrigger | IAction> = (isTrigger ? app?.triggers : app?.actions) || [];
  const actionOptions = React.useMemo(
    () => actionsOrTriggers.map((trigger) => optionGenerator(trigger)),
    [app?.key]
  );
  const selectedActionOrTrigger =
    actionsOrTriggers.find(
      (actionOrTrigger: IAction | ITrigger) => actionOrTrigger.key === step?.key
    );

  const { name } = substep;

  const valid: boolean = !!step.key && !!step.appKey;

  // placeholders
  const onEventChange = React.useCallback(
    (event: React.SyntheticEvent, selectedOption: unknown) => {
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
    },
    [step, onChange]
  );

  const onAppChange = React.useCallback(
    (event: React.SyntheticEvent, selectedOption: unknown) => {
      if (typeof selectedOption === 'object') {
        // TODO: try to simplify type casting below.
        const typedSelectedOption = selectedOption as { value: string };
        const option: { value: string } = typedSelectedOption;
        const appKey = option?.value as string;

        if (step.appKey !== appKey) {
          onChange({
            step: {
              ...step,
              key: '',
              appKey,
              parameters: {},
            },
          });
        }
      }
    },
    [step, onChange]
  );

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
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Autocomplete
            fullWidth
            disablePortal
            disableClearable
            disabled={editorContext.readOnly}
            options={appOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage('flowEditor.chooseApp')}
              />
            )}
            value={getOption(appOptions, step.appKey)}
            onChange={onAppChange}
          />

          {step.appKey && (
            <Box display="flex" width="100%" pt={2} flexDirection="column">
              <Typography variant="subtitle2" pb={2} gutterBottom>
                {isTrigger && formatMessage('flowEditor.triggerEvent')}
                {!isTrigger && formatMessage('flowEditor.actionEvent')}
              </Typography>

              <Autocomplete
                fullWidth
                disablePortal
                disableClearable
                disabled={editorContext.readOnly}
                options={actionOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={formatMessage('flowEditor.chooseEvent')}
                  />
                )}
                value={getOption(actionOptions, step.key)}
                onChange={onEventChange}
              />
            </Box>
          )}

          {isTrigger && (selectedActionOrTrigger as ITrigger)?.pollInterval && (
            <TextField
              label={formatMessage('flowEditor.pollIntervalLabel')}
              value={formatMessage('flowEditor.pollIntervalValue', {
                minutes: (selectedActionOrTrigger as ITrigger)?.pollInterval,
              })}
              sx={{ mt: 2 }}
              fullWidth
              disabled
            />
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={!valid || editorContext.readOnly}
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

export default ChooseAppAndEventSubstep;
