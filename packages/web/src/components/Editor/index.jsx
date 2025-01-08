import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import useCreateStep from 'hooks/useCreateStep';
import useUpdateStep from 'hooks/useUpdateStep';
import FlowStep from 'components/FlowStep';
import { FlowPropType } from 'propTypes/propTypes';
import { useQueryClient } from '@tanstack/react-query';

function Editor(props) {
  const { flow } = props;
  const { mutateAsync: updateStep } = useUpdateStep();
  const { mutateAsync: createStep, isPending: isCreateStepPending } =
    useCreateStep(flow?.id);
  const [triggerStep] = flow.steps;
  const [currentStepId, setCurrentStepId] = React.useState(triggerStep.id);
  const queryClient = useQueryClient();

  const onStepChange = React.useCallback(
    async (step) => {
      const payload = {
        id: step.id,
        key: step.key,
        parameters: step.parameters,
        connectionId: step.connection?.id,
      };

      if (step.name || step.keyLabel) {
        payload.name = step.name || step.keyLabel;
      }

      if (step.appKey) {
        payload.appKey = step.appKey;
      }

      await updateStep(payload);

      await queryClient.invalidateQueries({
        queryKey: ['steps', step.id, 'connection'],
      });
    },
    [updateStep, queryClient],
  );

  const addStep = React.useCallback(
    async (previousStepId) => {
      const { data: createdStep } = await createStep({
        previousStepId,
      });

      setCurrentStepId(createdStep.id);
    },
    [createStep],
  );

  const openNextStep = React.useCallback((nextStep) => {
    return () => {
      setCurrentStepId(nextStep?.id);
    };
  }, []);

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      alignItems="center"
      alignSelf="center"
      py={3}
      gap={1}
    >
      {flow?.steps?.map((step, index, steps) => (
        <React.Fragment key={`${step.id}-${index}`}>
          <FlowStep
            key={step.id}
            step={step}
            index={index + 1}
            collapsed={currentStepId !== step.id}
            onOpen={() => setCurrentStepId(step.id)}
            onClose={() => setCurrentStepId(null)}
            onChange={onStepChange}
            flowId={flow.id}
            onContinue={openNextStep(steps[index + 1])}
          />

          <IconButton
            onClick={() => addStep(step.id)}
            color="primary"
            disabled={isCreateStepPending || flow.active}
          >
            <AddIcon />
          </IconButton>
        </React.Fragment>
      ))}
    </Box>
  );
}

Editor.propTypes = {
  flow: FlowPropType.isRequired,
};

export default Editor;
