import * as React from 'react';

import { Wrapper } from './style';

type FlowStepProps = {
 collapsed?: boolean;
 step?: any;
}

export default function FlowStep(props: FlowStepProps) {
  const { step } = props;

  return (
    <Wrapper elevation={1}>
      {step?.type} - {step?.appKey} - {step?.key} - {step?.connectionId}
    </Wrapper>
  )
};
