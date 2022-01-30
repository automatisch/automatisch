import * as React from 'react';
import { useMutation } from '@apollo/client';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

import { GET_FLOW } from 'graphql/queries/get-flow';
import { CREATE_STEP } from 'graphql/mutations/create-step';
import { UPDATE_STEP } from 'graphql/mutations/update-step';
import FlowStep from 'components/FlowStep';
import type { Flow } from 'types/flow';

type EditorProps = {
  flow: Flow;
};

function updateHandlerFactory(flowId: string, previousStepId: string) {
  return function createStepUpdateHandler(cache: any, mutationResult: any) {
    const { data } = mutationResult;
    const { createStep: createdStep } = data;
    const { getFlow: flow } = cache.readQuery({
      query: GET_FLOW,
      variables: { id: flowId },
    });
    const steps = flow.steps.reduce((steps: any[], currentStep: any) => {
      if (currentStep.id === previousStepId) {
        return [...steps, currentStep, createdStep];
      }

      return [...steps, currentStep];
    }, []);

    cache.writeQuery({
      query: GET_FLOW,
      variables: { id: flowId },
      data: { getFlow: { ...flow, steps } },
    });
  };
}

export default function Editor(props: EditorProps): React.ReactElement {
  const [updateStep] = useMutation(UPDATE_STEP);
  const [createStep, { loading: creationInProgress }] = useMutation(CREATE_STEP);
  const [currentStep, setCurrentStep] = React.useState<number | null>(0);
  const { flow } = props;

  const onStepChange = React.useCallback(
    (step: any) => {
      const mutationInput: Record<string, unknown> = {
        id: step.id,
        key: step.key,
        parameters: JSON.stringify(step.parameters, null, 2),
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

      updateStep({ variables: { input: mutationInput } });
    },
    [updateStep, flow.id]
  );

  const addStep = React.useCallback(
    (previousStepId) => {
      const mutationInput = {
        previousStep: {
          id: previousStepId,
        },
        flow: {
          id: flow.id,
        },
      };

      createStep({
        variables: { input: mutationInput },
        update: updateHandlerFactory(flow.id, previousStepId),
      });
    },
    [createStep, flow.id]
  );

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
      {flow?.steps?.map((step, index) => (
        <React.Fragment key={`${step}-${index}`}>
          <FlowStep
            key={step.id}
            step={step}
            index={index + 1}
            collapsed={currentStep !== index}
            onOpen={() => setCurrentStep(index)}
            onClose={() => setCurrentStep(null)}
            onChange={onStepChange}
          />

          <IconButton onClick={() => addStep(step.id)} color="primary" disabled={creationInProgress}>
            <AddIcon />
          </IconButton>
        </React.Fragment>
      ))}
    </Box>
  );
}
