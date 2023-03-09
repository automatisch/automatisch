import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import type { IField, IStep, ISubstep } from '@automatisch/types';

import { EditorContext } from 'contexts/Editor';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import InputCreator from 'components/InputCreator';
import FilterConditions from './FilterConditions';

type FlowSubstepProps = {
  substep: ISubstep;
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange: ({ step }: { step: IStep }) => void;
  onSubmit: () => void;
  step: IStep;
};

const validateSubstep = (substep: ISubstep, step: IStep) => {
  if (!substep) return true;

  const args: IField[] = substep.arguments || [];

  return args.every((arg) => {
    if (arg.required === false) {
      return true;
    }

    const argValue = step.parameters?.[arg.key];

    // `false` is an exceptional valid value
    if (argValue === false) return true;

    return Boolean(argValue);
  });
};

function FlowSubstep(props: FlowSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onSubmit,
    step,
  } = props;

  const { name, arguments: args } = substep;

  const editorContext = React.useContext(EditorContext);
  const formContext = useFormContext();
  const [validationStatus, setValidationStatus] = React.useState<
    boolean | null
  >(validateSubstep(substep, formContext.getValues() as IStep));

  React.useEffect(() => {
    function validate(step: unknown) {
      const validationResult = validateSubstep(substep, step as IStep);
      setValidationStatus(validationResult);
    }
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
        <ListItem
          sx={{
            pt: 2,
            pb: 3,
            flexDirection: 'column',
            alignItems: 'flex-start',
            position: 'relative'
          }}
        >
          {!!args?.length && (
            <Stack width="100%" spacing={2}>
              {args.map((argument) => (
                <InputCreator
                  key={argument.key}
                  schema={argument}
                  namePrefix="parameters"
                  stepId={step.id}
                  disabled={editorContext.readOnly}
                  showOptionValue={true}
                />
              ))}
            </Stack>
          )}

          {step.appKey === 'filter' && <FilterConditions stepId={step.id} />}

          <Button
            fullWidth
            variant="contained"
            onClick={onSubmit}
            sx={{ mt: 2 }}
            disabled={!validationStatus || editorContext.readOnly}
            type="submit"
            data-test="flow-substep-continue-button"
          >
            Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
}

export default FlowSubstep;
