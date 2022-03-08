import * as React from 'react';
import { useMutation } from '@apollo/client';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

import { EXECUTE_FLOW } from 'graphql/mutations/execute-flow';
import FlowSubstepTitle from 'components/FlowSubstepTitle';
import type { IStep, ISubstep } from '@automatisch/types';

type TestSubstepProps = {
  substep: ISubstep,
  expanded?: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onChange?: ({ step }: { step: IStep }) => void;
  onSubmit?: () => void;
  step: IStep;
};

function TestSubstep(props: TestSubstepProps): React.ReactElement {
  const {
    substep,
    expanded = false,
    onExpand,
    onCollapse,
    onSubmit,
    step,
  } = props;

  const [executeFlow, { data }] = useMutation(EXECUTE_FLOW);

  const response = data?.executeFlow?.data;

  const {
    name,
  } = substep;

  const handleSubmit = React.useCallback(() => {
    executeFlow({
      variables: {
        input: {
          stepId: step.id,
        },
      },
    })
  }, [onSubmit, step.id]);
  const onToggle = expanded ? onCollapse : onExpand;

  return (
    <React.Fragment>
      <FlowSubstepTitle
        expanded={expanded}
        onClick={onToggle}
        title={name}
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <ListItem sx={{ pt: 2, pb: 3, flexDirection: 'column', alignItems: 'flex-start' }}>

          {response && (
            <pre style={{ whiteSpace: 'pre-wrap', }}>
              {JSON.stringify(response, null, 2)}
            </pre>
          )}

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Test & Continue
          </Button>
        </ListItem>
      </Collapse>
    </React.Fragment>
  );
};

export default TestSubstep;
