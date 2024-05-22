import { EdgeLabelRenderer, getStraightPath } from 'reactflow';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useMutation } from '@apollo/client';
import { CREATE_STEP } from 'graphql/mutations/create-step';
import { useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';

export default function Edge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  data: { flowId, setCurrentStepId, flowActive, layouted },
}) {
  const [createStep, { loading: creationInProgress }] =
    useMutation(CREATE_STEP);
  const queryClient = useQueryClient();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const addStep = async (previousStepId) => {
    const mutationInput = {
      previousStep: {
        id: previousStepId,
      },
      flow: {
        id: flowId,
      },
    };

    const createdStep = await createStep({
      variables: { input: mutationInput },
    });

    const createdStepId = createdStep.data.createStep.id;
    setCurrentStepId(createdStepId);
    await queryClient.invalidateQueries({ queryKey: ['flows', flowId] });
  };

  return (
    <>
      <EdgeLabelRenderer>
        <IconButton
          onClick={() => addStep(source)}
          color="primary"
          sx={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            visibility: layouted ? 'visible' : 'hidden',
          }}
          disabled={creationInProgress || flowActive}
        >
          <AddIcon />
        </IconButton>
      </EdgeLabelRenderer>
    </>
  );
}

Edge.propTypes = {
  sourceX: PropTypes.number.isRequired,
  sourceY: PropTypes.number.isRequired,
  targetX: PropTypes.number.isRequired,
  targetY: PropTypes.number.isRequired,
  source: PropTypes.string.isRequired,
  data: PropTypes.shape({
    flowId: PropTypes.string.isRequired,
    setCurrentStepId: PropTypes.func.isRequired,
    flowActive: PropTypes.bool.isRequired,
    layouted: PropTypes.bool,
  }).isRequired,
};
