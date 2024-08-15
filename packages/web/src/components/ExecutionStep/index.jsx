import PropTypes from 'prop-types';
import * as React from 'react';
import { DateTime } from 'luxon';
import Stack from '@mui/material/Stack';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';

import TabPanel from 'components/TabPanel';
import SearchableJSONViewer from 'components/SearchableJSONViewer';
import AppIcon from 'components/AppIcon';
import useFormatMessage from 'hooks/useFormatMessage';
import useApps from 'hooks/useApps';
import {
  AppIconWrapper,
  AppIconStatusIconWrapper,
  Content,
  Header,
  Metadata,
  Wrapper,
} from './style';
import { ExecutionStepPropType, StepPropType } from 'propTypes/propTypes';

function ExecutionStepId(props) {
  const formatMessage = useFormatMessage();

  const id = (
    <Typography variant="caption" component="span">
      {props.id}
    </Typography>
  );

  return (
    <Box sx={{ display: 'flex' }} gridArea="id">
      <Typography variant="caption" fontWeight="bold">
        {formatMessage('executionStep.id', { id })}
      </Typography>
    </Box>
  );
}

ExecutionStepId.propTypes = {
  id: PropTypes.string.isRequired,
};

function ExecutionStepDate(props) {
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

ExecutionStepDate.propTypes = {
  createdAt: PropTypes.number.isRequired,
};

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

function ExecutionStep(props) {
  const { executionStep } = props;
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);
  const step = executionStep.step;
  const isTrigger = step.type === 'trigger';
  const isAction = step.type === 'action';
  const formatMessage = useFormatMessage();
  const useAppsOptions = {};

  if (isTrigger) {
    useAppsOptions.onlyWithTriggers = true;
  }

  if (isAction) {
    useAppsOptions.onlyWithActions = true;
  }

  const { data: apps } = useApps(useAppsOptions);

  const app = apps?.data?.find((currentApp) => currentApp.key === step.appKey);

  if (!apps?.data) return null;

  const validationStatusIcon =
    executionStep.status === 'success' ? validIcon : errorIcon;

  const hasError = !!executionStep.errorDetails;

  return (
    <Wrapper elevation={1} data-test="execution-step">
      <Header>
        <Stack direction="row" gap={3}>
          <AppIconWrapper>
            <AppIconStatusIconWrapper>
              <AppIcon url={app?.iconUrl} name={app?.name} />

              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <Metadata flex="1">
            <ExecutionStepId id={executionStep.step.id} />

            <Box flex="1" gridArea="step">
              <Typography variant="caption">
                {isTrigger && formatMessage('flowStep.triggerType')}
                {isAction && formatMessage('flowStep.actionType')}
              </Typography>

              <Typography variant="body2">
                {step.position}. {app?.name}
              </Typography>
            </Box>

            <Box
              display="flex"
              justifyContent={['left', 'right']}
              gridArea="date"
            >
              <ExecutionStepDate createdAt={executionStep.createdAt} />
            </Box>
          </Metadata>
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

ExecutionStep.propTypes = {
  collapsed: PropTypes.bool,
  step: StepPropType.isRequired,
  index: PropTypes.number,
  executionStep: ExecutionStepPropType.isRequired,
};

export default ExecutionStep;
