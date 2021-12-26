import * as React from 'react';
import Box from '@mui/material/Box';

import FlowStep from 'components/FlowStep';
import type { Flow } from 'types/flow';

type EditorProps = {
  flow: Flow;
}

export default function Editor(props: EditorProps) {
  const [currentStep, setCurrentStep] = React.useState<number | null>(null);
  const { flow } = props;

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      alignItems="center"
      alignSelf="center"
      py={3}
      gap={2}
    >
      {flow?.steps?.map((step, index) => (
        <FlowStep
          key={step.id}
          step={step}
          index={index + 1}
          collapsed={currentStep !== index}
          onOpen={() => setCurrentStep(index)}
          onClose={() => setCurrentStep(null)}
        />
      ))}
    </Box>
  )
};