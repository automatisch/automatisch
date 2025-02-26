import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PaginationItem from '@mui/material/PaginationItem';
import * as React from 'react';
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import Can from 'components/Can';
import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import FlowRow from 'components/FlowRow';
import Folders from 'components/Folders';
import ImportFlowDialog from 'components/ImportFlowDialog';
import SplitButton from 'components/SplitButton';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import TemplatesDialog from 'components/TemplatesDialog/index.ee';
import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFlows from 'hooks/useFlows';
import useFormatMessage from 'hooks/useFormatMessage';
import useAutomatischConfig from 'hooks/useAutomatischConfig';

export default function FlowsButtons() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const currentUserAbility = useCurrentUserAbility();
  const theme = useTheme();
  const { data: config } = useAutomatischConfig();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const canCreateFlow = currentUserAbility.can('create', 'Flow');
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
