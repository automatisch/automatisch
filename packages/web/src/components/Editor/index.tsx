import * as React from 'react';
import Box from '@mui/material/Box';

import FlowStep from 'components/FlowStep';
import type { Flow } from 'types/flow';

type EditorProps = {
  flow?: Flow;
}

export default function Editor(props: EditorProps) {
  const { flow } = props;

  return (
    <Box
      display="flex"
      flex={1}
      flexDirection="column"
      alignItems="center"
      width={800}
      maxWidth="100%"
      alignSelf="center"
      py={3}
      gap={2}
    >
      {flow?.steps?.map(step => (<FlowStep key={step.id} step={step} />))}
    </Box>
  )
};