import * as React from 'react';
import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import { CREATE_STEP } from 'graphql/mutations/create-step';
import { UPDATE_STEP } from 'graphql/mutations/update-step';
import FlowStep from 'components/FlowStep';
import { FlowPropType } from 'propTypes/propTypes';
import { useQueryClient } from '@tanstack/react-query';

function Editor(props) {
  const [updateStep] = useMutation(UPDATE_STEP);
  const [createStep, { loading: creationInProgress }] =
    useMutation(CREATE_STEP);
  const { flow } = props;
  const [triggerStep] = flow.steps;
  const [currentStepId, setCurrentStepId] = React.useState(triggerStep.id);
  const queryClient = useQueryClient();

  const onStepChange = React.useCallback(
    async (step) => {
      const mutationInput = {
        id: step.id,
        key: step.key,
        parameters: step.parameters,
        connection: {
          id: step.connection?.id,
        },
        flow: {
          id: flow.id,
        },
      };

      if (step.appKey) {
        mutationInput.appKey = step.appKey;
      }

      await updateStep({ variables: { input: mutationInput } });
      await queryClient.invalidateQueries({
        queryKey: ['steps', step.id, 'connection'],
      });
      await queryClient.invalidateQueries({ queryKey: ['flows', flow.id] });
    },
    [updateStep, flow.id, queryClient],
  );

  const addStep = React.useCallback(
    async (previousStepId) => {
      const mutationInput = {
        previousStep: {
          id: previousStepId,
        },
        flow: {
          id: flow.id,
        },
      };

      const createdStep = await createStep({
        variables: { input: mutationInput },
      });

      const createdStepId = createdStep.data.createStep.id;
      setCurrentStepId(createdStepId);
      await queryClient.invalidateQueries({ queryKey: ['flows', flow.id] });
    },
    [createStep, flow.id, queryClient],
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
            disabled={creationInProgress || flow.active}
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
