import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import FlowSubstepTitle from 'components/FlowSubstepTitle';
import InputCreator from 'components/InputCreator';
import type { Step, Substep } from 'types/step';
import type { AppFields } from 'types/app';

type FlowSubstepProps = {
  substep: Substep,
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange: ({ step }: { step: Step }) => void;
  onSubmit: () => void;
  step: Step;
};

const validateSubstep = (substep: Substep, step: Step) => {
  if (!substep) return true;

  const args: AppFields[] = substep.arguments || [];

  return args.every(arg => {
    if (arg.required === false) { return true; }

    const argValue = step.parameters[arg.key];

    return argValue !== null && argValue !== undefined;
  });
};

function FlowSubstep(props: FlowSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onChange,
    onSubmit,
    step,
  } = props;

  const {
    name,
    arguments: args,
  } = substep;

  const handleChangeOnBlur = React.useCallback((event: React.SyntheticEvent) => {
    const { name, value: newValue } = event.target as HTMLInputElement;
    const currentValue = step.parameters?.[name];

    if (currentValue !== newValue) {
      onChange({
        step: {
          ...step,
          parameters: {
            ...step.parameters,
            [name]: newValue,
          }
        },
      });
    }
  }, [step, onChange]);

  const onToggle = expanded ? onCollapse : onExpand;
  const valid = validateSubstep(substep, step);

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
          <React.Fragment>
            {args?.map((argument) => (
              <InputCreator key={argument?.key} schema={argument} onBlur={handleChangeOnBlur} />
            ))}
          </React.Fragment>

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
};

export default FlowSubstep;
