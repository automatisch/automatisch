import * as React from 'react';
import {
  Link,
  Route,
  Navigate,
  Routes,
  useParams,
  useMatch,
  useNavigate,
} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import SwapCallsIcon from '@mui/icons-material/SwapCalls';

import Container from 'components/Container';
import EditableTypography from 'components/EditableTypography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import useFormatMessage from 'hooks/useFormatMessage';
import useMcpServer from 'hooks/useMcpServer.ee';
import useUpdateMcpServer from 'hooks/useUpdateMcpServer.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import McpServerTools from 'components/McpServerTools/index.ee';
import McpServerConnect from 'components/McpServerConnect/index.ee';
import McpServerExecutions from 'components/McpServerExecutions/index.ee';
import AddMcpActionDialog from 'components/AddMcpActionDialog/index.ee';
import AddMcpFlowDialog from 'components/AddMcpFlowDialog/index.ee';
import * as URLS from 'config/urls';
import Can from 'components/Can';

export default function McpServer() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const { mcpServerId } = useParams();
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data, isLoading } = useMcpServer(mcpServerId);
  const { mutateAsync: updateMcpServer } = useUpdateMcpServer(mcpServerId);
  const [addToolMenuAnchorEl, setAddToolMenuAnchorEl] = React.useState(null);

  const toolsPathMatch = useMatch({
    path: URLS.MCP_SERVER_TOOLS_PATTERN,
    end: false,
  });
  const connectPathMatch = useMatch({
    path: URLS.MCP_SERVER_CONNECT_PATTERN,
    end: false,
  });
  const executionsPathMatch = useMatch({
    path: URLS.MCP_SERVER_EXECUTIONS_PATTERN,
    end: false,
  });

  const mcpServer = data?.data;
  const isToolsTab = Boolean(toolsPathMatch);
  const isAddToolMenuOpen = Boolean(addToolMenuAnchorEl);

  const handleAddToolClick = (event) => {
    setAddToolMenuAnchorEl(event.currentTarget);
  };

  const handleAddToolMenuClose = () => {
    setAddToolMenuAnchorEl(null);
  };

  const handleAddToolMenuItemClick = (url) => {
    handleAddToolMenuClose();
    navigate(url);
  };

  const addToolOptions = [
    {
      label: formatMessage('mcpServer.addAction'),
      key: 'add-action',
      'data-test': 'add-action-button',
      to: URLS.MCP_SERVER_ADD_ACTION(mcpServerId),
      startIcon: <AddIcon />,
    },
    {
      label: formatMessage('mcpServer.addFlow'),
      key: 'add-flow',
      'data-test': 'add-flow-button',
      to: URLS.MCP_SERVER_ADD_FLOW(mcpServerId),
      startIcon: <SwapCallsIcon />,
    },
  ];

  const goToToolsPage = () => {
    navigate(URLS.MCP_SERVER_TOOLS(mcpServerId));
  };

  const handleNameUpdate = async (newName) => {
    try {
      await updateMcpServer({ name: newName });
      enqueueSnackbar(formatMessage('mcpServer.nameUpdated'), {
        variant: 'success',
      });
    } catch {
      enqueueSnackbar(formatMessage('mcpServer.nameUpdateError'), {
        variant: 'error',
      });
    }
  };

  return (
    <Can I="read" a="McpServer">
      <Box sx={{ py: 3 }}>
        <Container>
          {isLoading && (
            <CircularProgress
              data-test="mcp-server-loader"
              sx={{ display: 'block', margin: '20px auto' }}
            />
          )}

          {!isLoading && mcpServer && (
            <>
              <Grid container sx={{ mb: 3 }} alignItems="center">
                <Grid item xs>
                  <Can I="manage" a="McpServer" passThrough>
                    {(allowed) => (
                      <EditableTypography
                        variant="h4"
                        component="h1"
                        disabled={!allowed}
                        onConfirm={handleNameUpdate}
                        sx={{ fontSize: '2.125rem', fontWeight: 400 }}
                      >
                        {mcpServer.name || `Untitled`}
                      </EditableTypography>
                    )}
                  </Can>
                </Grid>

                {isToolsTab && (
                  <Grid item xs="auto">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<ArrowDropDownIcon />}
                      onClick={handleAddToolClick}
                      data-test="add-tool-button"
                    >
                      {formatMessage('mcpServer.addTool')}
                    </Button>
                    <Menu
                      anchorEl={addToolMenuAnchorEl}
                      open={isAddToolMenuOpen}
                      onClose={handleAddToolMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      {addToolOptions.map((option) => (
                        <MenuItem
                          key={option.key}
                          onClick={() => handleAddToolMenuItemClick(option.to)}
                          data-test={option['data-test']}
                        >
                          {option.startIcon && (
                            <Box
                              sx={{
                                mr: 1,
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              {option.startIcon}
                            </Box>
                          )}
                          {option.label}
                        </MenuItem>
                      ))}
                    </Menu>
                  </Grid>
                )}
              </Grid>

              <Grid container>
                <Grid item xs>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                      variant={matchSmallScreens ? 'fullWidth' : undefined}
                      value={
                        toolsPathMatch?.pattern?.path ||
                        connectPathMatch?.pattern?.path ||
                        executionsPathMatch?.pattern?.path
                      }
                    >
                      <Tab
                        label={formatMessage('mcpServer.tools')}
                        to={URLS.MCP_SERVER_TOOLS(mcpServerId)}
                        value={URLS.MCP_SERVER_TOOLS_PATTERN}
                        component={Link}
                        data-test="tools-tab"
                      />
                      <Tab
                        label={formatMessage('mcpServer.connect')}
                        to={URLS.MCP_SERVER_CONNECT(mcpServerId)}
                        value={URLS.MCP_SERVER_CONNECT_PATTERN}
                        component={Link}
                        data-test="connect-tab"
                      />
                      <Tab
                        label={formatMessage('mcpServer.executions')}
                        to={URLS.MCP_SERVER_EXECUTIONS(mcpServerId)}
                        value={URLS.MCP_SERVER_EXECUTIONS_PATTERN}
                        component={Link}
                        data-test="executions-tab"
                      />
                    </Tabs>
                  </Box>

                  <Routes>
                    <Route
                      path="/tools/*"
                      element={<McpServerTools mcpServerId={mcpServerId} />}
                    />
                    <Route
                      path="/connect"
                      element={<McpServerConnect mcpServerId={mcpServerId} />}
                    />
                    <Route
                      path="/executions"
                      element={
                        <McpServerExecutions mcpServerId={mcpServerId} />
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <Navigate
                          to={URLS.MCP_SERVER_TOOLS(mcpServerId)}
                          replace
                        />
                      }
                    />
                  </Routes>
                </Grid>
              </Grid>
            </>
          )}
        </Container>
      </Box>

      <Routes>
        <Route
          path="/tools/add-action"
          element={
            <AddMcpActionDialog
              mcpServerId={mcpServerId}
              onClose={goToToolsPage}
            />
          }
        />
        <Route
          path="/tools/add-flow"
          element={
            <AddMcpFlowDialog
              mcpServerId={mcpServerId}
              onClose={goToToolsPage}
            />
          }
        />
      </Routes>
    </Can>
  );
}
