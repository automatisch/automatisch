import * as React from 'react';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { IApp, IExecutionStep, IStep } from '@automatisch/types';

import TabPanel from 'components/TabPanel';
import JSONViewer from 'components/JSONViewer';
import AppIcon from 'components/AppIcon';
import { GET_APPS } from 'graphql/queries/get-apps';
import useFormatMessage from 'hooks/useFormatMessage';
import { AppIconWrapper, AppIconStatusIconWrapper, Content, Header, Wrapper } from './style';

type ExecutionStepProps = {
  collapsed?: boolean;
  step: IStep;
  index?: number;
  executionStep: IExecutionStep;
}

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

export default function ExecutionStep(props: ExecutionStepProps): React.ReactElement | null {
  const { executionStep, } = props;
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const step: IStep = executionStep.step;
  const isTrigger = step.type === 'trigger';
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_APPS, { variables: { onlyWithTriggers: isTrigger }});
  const apps: IApp[] = data?.getApps;
  const app = apps?.find((currentApp: IApp) => currentApp.key === step.appKey);

  if  (!apps) return null;

  const validationStatusIcon = executionStep.status === 'success' ? validIcon : errorIcon;

  return (
    <Wrapper elevation={1} data-test="execution-step">
      <Header>
        <Stack direction="row" alignItems="center" gap={2}>
          <AppIconWrapper>
            <AppIcon url={app?.iconUrl} name={app?.name} />

            <AppIconStatusIconWrapper>
              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <div>
            <Typography variant="caption">
              {
                isTrigger ?
                  formatMessage('flowStep.triggerType') :
                  formatMessage('flowStep.actionType')
              }
            </Typography>

            <Typography variant="body2">
              {step.position}. {app?.name}
            </Typography>
          </div>
        </Stack>
      </Header>

      <Content sx={{ px: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTabIndex} onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}>
            <Tab label="Data in" data-test="data-in-tab" />
            <Tab label="Data out" data-test="data-out-tab" />
            <Tab label="Error" data-test="error-tab" />
          </Tabs>
        </Box>

        <TabPanel value={activeTabIndex} index={0}>
          <JSONViewer data={executionStep.dataIn} />
        </TabPanel>

        <TabPanel value={activeTabIndex} index={1}>
          <JSONViewer data={executionStep.dataOut} />
        </TabPanel>

        <TabPanel value={activeTabIndex} index={2}>
          <JSONViewer data={executionStep.errorDetails} />
        </TabPanel>
      </Content>

    </Wrapper>
  )
};
