import * as React from 'react';
import {
  Route,
  Routes,
  useParams,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
// import SwapCallsIcon from '@mui/icons-material/SwapCalls';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SaveIcon from '@mui/icons-material/Save';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';

import Container from 'components/Container';
import EditableTypography from 'components/EditableTypography';
import AgentTools from 'components/AgentTools/index.ee';
import AgentExecutions from 'components/AgentExecutions/index.ee';
import AgentExecutionDetail from 'components/AgentExecutionDetail/index.ee';
import AgentChat from 'components/AgentChat/index.ee';
import AddAgentActionDialog from 'components/AddAgentActionDialog/index.ee';
import AddAgentFlowDialog from 'components/AddAgentFlowDialog/index.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useAgent from 'hooks/useAgent.ee';
import useUpdateAgent from 'hooks/useUpdateAgent.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as URLS from 'config/urls';
import Can from 'components/Can';

export default function Agent() {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const { agentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data, isLoading } = useAgent(agentId);
  const { mutateAsync: updateAgent } = useUpdateAgent(agentId);
  const [addToolMenuAnchorEl, setAddToolMenuAnchorEl] = React.useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = React.useState(false);
  const [mobileChatOpen, setMobileChatOpen] = React.useState(false);

  const [description, setDescription] = React.useState('');
  const [instructions, setInstructions] = React.useState('');
  const [hasChanges, setHasChanges] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState([]);

  const agent = data?.data;
  const isAddToolMenuOpen = Boolean(addToolMenuAnchorEl);

  // Determine active tab and view based on URL
  const isExecutionsTab = location.pathname.includes('/executions');
  const isExecutionDetailView = location.pathname.match(/\/executions\/[^/]+$/);
  const activeTab = isExecutionsTab ? 'executions' : 'setup';

  React.useEffect(() => {
    if (agent) {
      setDescription(agent.description || '');
      setInstructions(agent.instructions || '');
      setHasChanges(false);
    }
  }, [agent]);

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
      label: formatMessage('agent.addAction'),
      key: 'add-action',
      'data-test': 'add-action-button',
      to: URLS.AGENT_ADD_ACTION(agentId),
      startIcon: <AddIcon />,
    },
    // {
    //   label: formatMessage('agent.addFlow'),
    //   key: 'add-flow',
    //   'data-test': 'add-flow-button',
    //   to: URLS.AGENT_ADD_FLOW(agentId),
    //   startIcon: <SwapCallsIcon />,
    // },
  ];

  const goToToolsPage = () => {
    navigate(URLS.AGENT(agentId));
  };

  const handleNameUpdate = async (newName) => {
    try {
      await updateAgent({ name: newName });
      enqueueSnackbar(formatMessage('agent.nameUpdated'), {
        variant: 'success',
      });
    } catch {
      enqueueSnackbar(formatMessage('agent.nameUpdateError'), {
        variant: 'error',
      });
    }
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setHasChanges(true);
  };

  const handleInstructionsChange = (event) => {
    setInstructions(event.target.value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await updateAgent({
        description: description || '',
        instructions: instructions || '',
      });
      enqueueSnackbar(formatMessage('agent.updated'), {
        variant: 'success',
      });
      setHasChanges(false);
    } catch {
      enqueueSnackbar(formatMessage('agent.updateError'), {
        variant: 'error',
      });
    }
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const toggleMobileChat = () => {
    setMobileChatOpen(!mobileChatOpen);
  };

  const leftSidebarContent = (
    <>
      {/* Settings Section - Primary */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 500 }}>
            {formatMessage('agent.settings')}
          </Typography>
          <Can I="manage" a="Agent" passThrough>
            {(allowed) => (
              <Button
                variant="contained"
                size="small"
                disabled={!allowed || !hasChanges}
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{ fontWeight: 500 }}
                data-test="save-agent-button"
              >
                {formatMessage('agent.save')}
              </Button>
            )}
          </Can>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Can I="manage" a="Agent" passThrough>
            {(allowed) => (
              <>
                <TextField
                  fullWidth
                  label={formatMessage('agent.description')}
                  multiline
                  rows={3}
                  value={description}
                  onChange={handleDescriptionChange}
                  disabled={!allowed}
                  sx={{ bgcolor: 'white' }}
                  placeholder={formatMessage('agent.descriptionPlaceholder')}
                  data-test="agent-description-field"
                />
                <TextField
                  fullWidth
                  label={formatMessage('agent.instructions')}
                  multiline
                  rows={10}
                  value={instructions}
                  onChange={handleInstructionsChange}
                  sx={{ bgcolor: 'white' }}
                  disabled={!allowed}
                  placeholder={formatMessage('agent.instructionsPlaceholder')}
                  data-test="agent-instructions-field"
                />
              </>
            )}
          </Can>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Tools Section - Secondary */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 500 }}>
            {formatMessage('agent.tools')}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            endIcon={<ArrowDropDownIcon />}
            onClick={handleAddToolClick}
            data-test="add-tool-button"
            sx={{ fontWeight: 500 }}
          >
            {formatMessage('agent.addTool')}
          </Button>
        </Box>
        <AgentTools agentId={agentId} />
      </Box>
    </>
  );

  return (
    <Can I="read" a="Agent">
      <Box
        sx={{
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            py: 2,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {matchSmallScreens && (
                <IconButton onClick={toggleMobileDrawer}>
                  <MenuIcon />
                </IconButton>
              )}

              {isLoading ? (
                <CircularProgress size={24} />
              ) : (
                agent && (
                  <Can I="manage" a="Agent" passThrough>
                    {(allowed) => (
                      <EditableTypography
                        variant="h3"
                        component="h1"
                        disabled={!allowed}
                        onConfirm={handleNameUpdate}
                        sx={{ fontWeight: 500 }}
                      >
                        {agent.name || formatMessage('agent.untitled')}
                      </EditableTypography>
                    )}
                  </Can>
                )
              )}

              {matchSmallScreens && activeTab === 'setup' && (
                <IconButton onClick={toggleMobileChat} sx={{ ml: 'auto' }}>
                  <ChatIcon />
                </IconButton>
              )}
            </Box>
          </Container>
        </Box>

        {/* Tabs */}
        <Box>
          <Container maxWidth="xl">
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => {
                if (newValue === 'executions') {
                  navigate(URLS.AGENT_EXECUTIONS(agentId));
                } else {
                  navigate(URLS.AGENT(agentId));
                }
              }}
            >
              <Tab
                label={formatMessage('agent.setup')}
                value="setup"
                data-test="setup-tab"
              />
              <Tab
                label={formatMessage('agent.executions')}
                value="executions"
                data-test="executions-tab"
              />
            </Tabs>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />
          </Container>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {!isLoading && agent && (
            <>
              {/* Desktop Layout */}
              {!matchSmallScreens && (
                <>
                  {activeTab === 'setup' ? (
                    <Container maxWidth="xl" sx={{ height: '100%', py: 3 }}>
                      <Box sx={{ display: 'flex', gap: 3, height: '100%' }}>
                        {/* Setup View: Settings/Tools (60%) + Chat (40%) */}
                        <Box
                          sx={{
                            width: '60%',
                            maxWidth: '800px',
                            minWidth: '500px',
                            overflow: 'auto',
                            pr: 2,
                          }}
                        >
                          {leftSidebarContent}
                        </Box>

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: '300px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            boxShadow: 1,
                          }}
                        >
                          <AgentChat
                            agentId={agentId}
                            messages={chatMessages}
                            onMessagesChange={setChatMessages}
                          />
                        </Box>
                      </Box>
                    </Container>
                  ) : (
                    <>
                      {/* Executions View */}
                      {isExecutionDetailView ? (
                        <Container maxWidth="xl" sx={{ height: '100%', py: 3 }}>
                          <Routes>
                            <Route
                              path="/executions/:executionId"
                              element={<AgentExecutionDetail />}
                            />
                          </Routes>
                        </Container>
                      ) : (
                        <Container maxWidth="xl" sx={{ height: '100%', py: 3 }}>
                          <AgentExecutions agentId={agentId} />
                        </Container>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Mobile Layout */}
              {matchSmallScreens && (
                <>
                  {activeTab === 'setup' ? (
                    <>
                      {/* Show chat as main content on mobile for setup */}
                      <Box
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden',
                          p: 2,
                        }}
                      >
                        <AgentChat
                          agentId={agentId}
                          messages={chatMessages}
                          onMessagesChange={setChatMessages}
                        />
                      </Box>

                      {/* Left drawer for tools & settings */}
                      <Drawer
                        anchor="left"
                        open={mobileDrawerOpen}
                        onClose={toggleMobileDrawer}
                        sx={{
                          '& .MuiDrawer-paper': {
                            width: '85%',
                            maxWidth: 360,
                          },
                        }}
                      >
                        <Box sx={{ p: 2 }}>{leftSidebarContent}</Box>
                      </Drawer>
                    </>
                  ) : (
                    <>
                      {/* Executions view on mobile */}
                      {isExecutionDetailView ? (
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                          <Routes>
                            <Route
                              path="/executions/:executionId"
                              element={<AgentExecutionDetail />}
                            />
                          </Routes>
                        </Box>
                      ) : (
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                          <AgentExecutions agentId={agentId} />
                        </Box>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Box>

        {/* Menu for adding tools */}
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
      </Box>

      {/* Dialogs */}
      <Routes>
        <Route
          path="/tools/add-action"
          element={
            <AddAgentActionDialog agentId={agentId} onClose={goToToolsPage} />
          }
        />
        <Route
          path="/tools/add-flow"
          element={
            <AddAgentFlowDialog agentId={agentId} onClose={goToToolsPage} />
          }
        />
      </Routes>
    </Can>
  );
}
