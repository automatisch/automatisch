import * as React from 'react';
import { DateTime } from 'luxon';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { IApp, IExecutionStep, IStep } from '@automatisch/types';

import TabPanel from 'components/TabPanel';
import SearchableJSONViewer from 'components/SearchableJSONViewer';
import AppIcon from 'components/AppIcon';
import { GET_APPS } from 'graphql/queries/get-apps';
import useFormatMessage from 'hooks/useFormatMessage';
import {
  AppIconWrapper,
  AppIconStatusIconWrapper,
  Content,
  Header,
  Wrapper,
} from './style';

type ExecutionStepProps = {
  collapsed?: boolean;
  step: IStep;
  index?: number;
  executionStep: IExecutionStep;
};

function ExecutionStepId(props: Pick<IExecutionStep, 'id'>) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography variant="caption" fontWeight="bold">
        ID:{' '}
        <Typography variant="caption" component="span">
          {props.id}
        </Typography>
      </Typography>
    </Box>
  );
}

function ExecutionStepDate(props: Pick<IExecutionStep, 'createdAt'>) {
  const formatMessage = useFormatMessage();
  const createdAt = DateTime.fromMillis(parseInt(props.createdAt, 10));
  const relativeCreatedAt = createdAt.toRelative();

  return (
    <Tooltip
      title={createdAt.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}
    >
      <Typography variant="caption" gutterBottom>
        {formatMessage('executionStep.executedAt', {
          datetime: relativeCreatedAt,
        })}
      </Typography>
    </Tooltip>
  );
}

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

export default function ExecutionStep(
  props: ExecutionStepProps
): React.ReactElement | null {
  const { executionStep } = props;
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const step: IStep = executionStep.step;
  const isTrigger = step.type === 'trigger';
  const isAction = step.type === 'action';
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_APPS, {
    variables: { onlyWithTriggers: isTrigger, onlyWithActions: isAction },
  });
  const apps: IApp[] = data?.getApps;
  const app = apps?.find((currentApp: IApp) => currentApp.key === step.appKey);
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('sm'));

  if (!apps) return null;

  const validationStatusIcon =
    executionStep.status === 'success' ? validIcon : errorIcon;
  const hasError = !!executionStep.errorDetails;

  return (
    <Wrapper elevation={1} data-test="execution-step">
      <Header>
        <Stack direction="row" gap={2}>
          <AppIconWrapper>
            <AppIcon url={app?.iconUrl} name={app?.name} />

            <AppIconStatusIconWrapper matchSmallScreens={matchSmallScreens}>
              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <Box flex="1">
            {matchSmallScreens && (
              <ExecutionStepId id={executionStep.step.id} />
            )}

            <Typography variant="caption">
              {isTrigger
                ? formatMessage('flowStep.triggerType')
                : formatMessage('flowStep.actionType')}
            </Typography>

            <Typography variant="body2">
              {step.position}. {app?.name}
            </Typography>

            {matchSmallScreens && (
              <ExecutionStepDate createdAt={executionStep.createdAt} />
            )}
          </Box>

          {!matchSmallScreens && (
            <Stack alignItems="flex-end" alignSelf="flex-end">
              <ExecutionStepId id={executionStep.step.id} />
              <ExecutionStepDate createdAt={executionStep.createdAt} />
            </Stack>
          )}
        </Stack>
      </Header>

      <Content sx={{ px: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTabIndex}
            onChange={(event, tabIndex) => setActiveTabIndex(tabIndex)}
          >
            <Tab label="Data in" data-test="data-in-tab" />
            <Tab label="Data out" data-test="data-out-tab" />
            {hasError && <Tab label="Error" data-test="error-tab" />}
          </Tabs>
        </Box>

        <TabPanel value={activeTabIndex} index={0}>
          <SearchableJSONViewer data={executionStep.dataIn} />
        </TabPanel>

        <TabPanel value={activeTabIndex} index={1} data-test="data-out-panel">
          <SearchableJSONViewer data={executionStep.dataOut} />
        </TabPanel>

        {hasError && (
          <TabPanel value={activeTabIndex} index={2}>
            <SearchableJSONViewer data={executionStep.errorDetails} />
          </TabPanel>
        )}
      </Content>
    </Wrapper>
  );
}
