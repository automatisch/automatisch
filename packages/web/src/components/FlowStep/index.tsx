import * as React from 'react';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import AppIcon from 'components/AppIcon';
import { GET_APP } from 'graphql/queries/get-app';
import useFormatMessage from 'hooks/useFormatMessage';
import type { Step } from 'types/step';
import { StepType } from 'types/step';
import { Header, Wrapper } from './style';

type FlowStepProps = {
  collapsed?: boolean;
  step: Step;
  index?: number;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function FlowStep(props: FlowStepProps) {
  const { collapsed, index, step } = props;
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_APP, { variables: { key: step?.appKey }})
  const app = data?.getApp;

  if  (!app) return null;

  const onOpen = () => collapsed && props.onOpen?.();
  const onClose = () => props.onClose?.();

  return (
    <Wrapper elevation={collapsed ? 1 : 4} onClick={onOpen}>
      <Header borderBottom={!collapsed}>
        <Stack direction="row" alignItems="center" gap={2}>
          <AppIcon url={app.iconUrl} name={app.name} />

          <div>
            <Typography variant="caption">
            {step.type === StepType.Trigger ? formatMessage('flowStep.triggerType') : formatMessage('flowStep.actionType')}
            </Typography>

            <Typography variant="body2">
            {index}. {app.name}
            </Typography>
          </div>
        </Stack>
      </Header>

      {!collapsed && (
        <Button onClick={onClose}>
          Close
        </Button>
      )}
    </Wrapper>
  )
};
