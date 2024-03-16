import * as React from 'react';
import PropTypes from 'prop-types';
import AppIcon from 'components/AppIcon';
import IntermediateStepCount from 'components/IntermediateStepCount';

function FlowAppIcons(props) {
  const { steps } = props;
  const stepsCount = steps.length;
  const firstStep = steps[0];
  const lastStep = steps.length > 1 && steps[stepsCount - 1];
  const intermeaditeStepCount = stepsCount - 2;
  return (
    <>
      <AppIcon
        name=" "
        variant="rounded"
        url={firstStep.iconUrl}
        sx={{ width: 30, height: 30 }}
      />

      {intermeaditeStepCount > 0 && (
        <IntermediateStepCount count={intermeaditeStepCount} />
      )}

      {lastStep && (
        <AppIcon
          name=" "
          variant="rounded"
          url={lastStep.iconUrl}
          sx={{ width: 30, height: 30 }}
        />
      )}
    </>
  );
}

FlowAppIcons.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      iconUrl: PropTypes.string,
    }),
  ).isRequired,
};

export default FlowAppIcons;
