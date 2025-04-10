import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { Link } from 'react-router-dom';

import SplitButton from 'components/SplitButton';

import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';
import useAutomatischConfig from 'hooks/useAutomatischConfig';

export default function FlowsButtons() {
  const formatMessage = useFormatMessage();
  const currentUserAbility = useCurrentUserAbility();
  const theme = useTheme();
  const { data: config } = useAutomatischConfig();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const canCreateFlow = currentUserAbility.can('manage', 'Flow');
  const enableTemplates = config?.data.enableTemplates === true;

  const createFlowButtonData = {
    label: formatMessage('flows.createFlow'),
    key: 'createFlow',
    'data-test': 'create-flow-button',
    to: URLS.CREATE_FLOW,
    startIcon: <AddIcon />,
  };

  const createFlowFromTemplateButtonData = {
    label: formatMessage('flows.createFlowFromTemplate'),
    key: 'createFlowFromTemplate',
    'data-test': 'create-flow-from-template-button',
    hide: !enableTemplates,
    to: URLS.VIEW_TEMPLATES,
  };

  const importFlowButtonData = {
    label: formatMessage('flows.importFlow'),
    key: 'importFlow',
    'data-test': 'import-flow-button',
    to: URLS.IMPORT_FLOW,
  };

  if (matchSmallScreens) {
    const connectionOptions = [
      createFlowButtonData,
      createFlowFromTemplateButtonData,
      importFlowButtonData,
    ].filter((option) => !option.hide);

    return (
      <>
        <SplitButton disabled={!canCreateFlow} options={connectionOptions} />
      </>
    );
  }

  return (
    <>
      <Button
        type="submit"
        variant="outlined"
        color="info"
        size="large"
        component={Link}
        disabled={!canCreateFlow}
        startIcon={<UploadIcon />}
        to={URLS.IMPORT_FLOW}
        data-test="import-flow-button"
      >
        {formatMessage('flows.importFlow')}
      </Button>

      <SplitButton
        disabled={!canCreateFlow}
        options={[
          createFlowButtonData,
          createFlowFromTemplateButtonData,
        ].filter((option) => !option.hide)}
      />
    </>
  );
}
