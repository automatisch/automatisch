import * as React from 'react';
import { useFormContext } from 'react-hook-form';
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

    const argValue = step.parameters?.[arg.key];

    return Boolean(argValue);
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

  const formContext = useFormContext();
  const [validationStatus, setValidationStatus] = React.useState<boolean | null>(validateSubstep(substep, formContext.getValues() as Step));


  const handleChangeOnBlur = React.useCallback((key: string) => {
    return (value: string) => {
      const currentValue = step.parameters?.[key];

      if (currentValue !== value) {
        onChange({
          step: {
            ...step,
            parameters: {
              ...step.parameters,
              [key]: value,
            }
          },
        });
      }
    }
  }, [step, onChange]);

  React.useEffect(() => {
    function validate (step: unknown) {
      const validationResult = validateSubstep(substep, step as Step);
      setValidationStatus(validationResult);
    };
    const subscription = formContext.watch(validate);

    return () => subscription.unsubscribe();
  }, [substep, formContext.watch]);

  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
        valid={validationStatus}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem sx={{ pt: 2, pb: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
          {args?.map((argument) => (
            <InputCreator
              key={argument.key}
              schema={argument}
              namePrefix="parameters"
            />
          ))}

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={!validationStatus}
            type="submit"
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
};

export default FlowSubstep;
