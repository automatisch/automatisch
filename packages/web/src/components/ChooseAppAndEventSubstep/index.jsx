import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import useFormatMessage from 'hooks/useFormatMessage';
import useApps from 'hooks/useApps';
import { EditorContext } from 'contexts/Editor';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
const optionGenerator = (app) => ({
  label: app.name,
  value: app.key,
});
const eventOptionGenerator = (app) => ({
  label: app.name,
  value: app.key,
  type: app?.type,
});
const getOption = (options, selectedOptionValue) =>
  options.find((option) => option.value === selectedOptionValue);
function ChooseAppAndEventSubstep(props) {
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
  const isAction = step.type === 'action';
  const { apps } = useApps({
    onlyWithTriggers: isTrigger,
    onlyWithActions: isAction,
  });
  const app = apps?.find((currentApp) => currentApp.key === step.appKey);
  const appOptions = React.useMemo(
    () => apps?.map((app) => optionGenerator(app)) || [],
    [apps],
  );
  const actionsOrTriggers = (isTrigger ? app?.triggers : app?.actions) || [];
  const actionOrTriggerOptions = React.useMemo(
    () => actionsOrTriggers.map((trigger) => eventOptionGenerator(trigger)),
    [app?.key],
  );
  const selectedActionOrTrigger = actionsOrTriggers.find(
    (actionOrTrigger) => actionOrTrigger.key === step?.key,
  );
  const isWebhook = isTrigger && selectedActionOrTrigger?.type === 'webhook';
  const { name } = substep;
  const valid = !!step.key && !!step.appKey;
  // placeholders
  const onEventChange = React.useCallback(
    (event, selectedOption) => {
      if (typeof selectedOption === 'object') {
        // TODO: try to simplify type casting below.
        const typedSelectedOption = selectedOption;
        const option = typedSelectedOption;
        const eventKey = option?.value;
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
    [step, onChange],
  );
  const onAppChange = React.useCallback(
    (event, selectedOption) => {
      if (typeof selectedOption === 'object') {
        // TODO: try to simplify type casting below.
        const typedSelectedOption = selectedOption;
        const option = typedSelectedOption;
        const appKey = option?.value;
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
    [step, onChange],
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
            disableClearable={getOption(appOptions, step.appKey) !== undefined}
            disabled={editorContext.readOnly}
            options={appOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label={formatMessage('flowEditor.chooseApp')}
              />
            )}
            value={getOption(appOptions, step.appKey) || null}
            onChange={onAppChange}
            data-test="choose-app-autocomplete"
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
                disableClearable={
                  getOption(actionOrTriggerOptions, step.key) !== undefined
                }
                disabled={editorContext.readOnly}
                options={actionOrTriggerOptions}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={formatMessage('flowEditor.chooseEvent')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <React.Fragment>
                          {isWebhook && (
                            <Chip
                              label={formatMessage(
                                'flowEditor.instantTriggerType',
                              )}
                            />
                          )}

                          {params.InputProps.endAdornment}
                        </React.Fragment>
                      ),
                    }}
                  />
                )}
                renderOption={(optionProps, option) => (
                  <li
                    {...optionProps}
                    key={option.value.toString()}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography>{option.label}</Typography>

                    {option.type === 'webhook' && (
                      <Chip
                        label={formatMessage('flowEditor.instantTriggerType')}
                        sx={{ mr: 3 }}
                      />
                    )}
                  </li>
                )}
                value={getOption(actionOrTriggerOptions, step.key) || null}
                onChange={onEventChange}
                data-test="choose-event-autocomplete"
              />
            </Box>
          )}

          {isTrigger && selectedActionOrTrigger?.pollInterval && (
            <TextField
              label={formatMessage('flowEditor.pollIntervalLabel')}
              value={formatMessage('flowEditor.pollIntervalValue', {
                minutes: selectedActionOrTrigger?.pollInterval,
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
            data-test="flow-substep-continue-button"
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}
export default ChooseAppAndEventSubstep;
