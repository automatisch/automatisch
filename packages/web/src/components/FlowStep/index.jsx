import PropTypes from 'prop-types';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ErrorIcon from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { EditorContext } from 'contexts/Editor';
import { NodesContext } from 'components/Editor/contexts';
import FlowStepContextMenu from 'components/FlowStepContextMenu';
import AppIcon from 'components/AppIcon';

import useFormatMessage from 'hooks/useFormatMessage';
import useApps from 'hooks/useApps';
import {
  AppIconWrapper,
  AppIconStatusIconWrapper,
  Header,
  Wrapper,
  ContextMenuButton,
} from './style';
import { StepPropType } from 'propTypes/propTypes';
import useTriggers from 'hooks/useTriggers';
import useActions from 'hooks/useActions';

const validIcon = <CheckCircleIcon color="success" />;
const errorIcon = <ErrorIcon color="error" />;

function FlowStep(props) {
  const { onDelete, onSelect, flowId, step } = props;
  const editorContext = React.useContext(EditorContext);
  const { selectedStepId } = React.useContext(NodesContext);
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isTrigger = step.type === 'trigger';
  const formatMessage = useFormatMessage();
  const useAppsOptions = {};

  const isSelected = selectedStepId === step.id;

  const stepTypeName = isTrigger
    ? formatMessage('flowStep.triggerType')
    : formatMessage('flowStep.actionType');

  if (isTrigger) {
    useAppsOptions.onlyWithTriggers = true;
  } else {
    useAppsOptions.onlyWithActions = true;
  }

  const { data: apps } = useApps(useAppsOptions);

  const app = apps?.data?.find((currentApp) => currentApp.key === step.appKey);

  const { data: triggers } = useTriggers(app?.key);
  const { data: actions } = useActions(app?.key);

  const actionsOrTriggers = (isTrigger ? triggers?.data : actions?.data) || [];
  const actionOrTrigger = actionsOrTriggers?.find(
    ({ key }) => key === step.key,
  );

  if (!apps?.data) {
    return (
      <CircularProgress
        data-test="step-circular-loader"
        sx={{ display: 'block', my: 2 }}
      />
    );
  }

  const onContextMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const onContextMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(contextButtonRef.current);
  };

  const handleStepClick = () => {
    // Always select step for sidebar editing
    onSelect?.();
  };

  const validationStatusIcon =
    step.status === 'completed' ? validIcon : errorIcon;

  return (
    <Wrapper
      elevation={isSelected ? 3 : 1}
      onClick={handleStepClick}
      data-test="flow-step"
      sx={{
        border: '1px solid transparent',
        borderColor: isSelected ? 'primary.main' : 'transparent',
      }}
    >
      <Header>
        <Stack direction="row" alignItems="center" gap={2}>
          <AppIconWrapper>
            <AppIcon
              url={app?.iconUrl}
              name={app?.name}
              color={app?.primaryColor}
            />

            <AppIconStatusIconWrapper>
              {validationStatusIcon}
            </AppIconStatusIconWrapper>
          </AppIconWrapper>

          <Stack direction="column" gap={0.5} sx={{ width: '100%' }}>
            {app?.name && (
              <Typography
                component={Stack}
                direction="row"
                variant="stepApp"
                alignItems="center"
                gap={0.5}
              >
                {app?.name}
              </Typography>
            )}
            {!app?.name && (
              <Chip
                label={stepTypeName}
                variant="stepType"
                size="small"
                sx={{ display: 'inline-flex', maxWidth: '80px' }}
              />
            )}

            <Typography
              data-test="step-name"
              variant="body2"
              noWrap
              sx={{ fontSize: 15, maxWidth: '195px' }}
            >
              <strong>{step.position}.</strong>{' '}
              {step.name || actionOrTrigger?.name || 'Select the event'}
            </Typography>
          </Stack>

          {!isTrigger && !editorContext.readOnly && (
            <ContextMenuButton
              color="primary"
              onClick={onContextMenuClick}
              ref={contextButtonRef}
              size="small"
            >
              <MoreVertIcon />
            </ContextMenuButton>
          )}
        </Stack>
      </Header>

      {anchorEl && (
        <FlowStepContextMenu
          stepId={step.id}
          deletable={!isTrigger}
          onClose={onContextMenuClose}
          onDelete={onDelete}
          anchorEl={anchorEl}
          flowId={flowId}
        />
      )}
    </Wrapper>
  );
}

FlowStep.propTypes = {
  step: StepPropType.isRequired,
  onSelect: PropTypes.func,
  onDelete: PropTypes.func,
  flowId: PropTypes.string.isRequired,
};

export default FlowStep;
