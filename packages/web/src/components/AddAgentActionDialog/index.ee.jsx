import * as React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import AppIcon from 'components/AppIcon';
import useFormatMessage from 'hooks/useFormatMessage';
import useLazyApps from 'hooks/useLazyApps';
import useActions from 'hooks/useActions';
import useAppConnections from 'hooks/useAppConnections';
import useCreateAgentTool from 'hooks/useCreateAgentTool.ee';

export default function AddAgentActionDialog({ agentId, onClose }) {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('sm'));
  const formatMessage = useFormatMessage();
  const [appName, setAppName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedApp, setSelectedApp] = React.useState(null);
  const [step, setStep] = React.useState('selectApp');
  const [selectedActions, setSelectedActions] = React.useState(new Set());
  const [selectedConnection, setSelectedConnection] = React.useState(null);

  const { data: apps, mutate } = useLazyApps(
    { appName },
    {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  );

  const { data: actions, isLoading: isActionsLoading } = useActions(selectedApp?.key);
  const { data: connections, isLoading: isConnectionsLoading } = useAppConnections(selectedApp?.key);
  const { mutateAsync: createAgentTool, isLoading: isCreatingTool } = useCreateAgentTool(agentId);

  const fetchData = React.useMemo(() => debounce(mutate, 300), [mutate]);

  React.useEffect(() => {
    if (step === 'selectApp') {
      setIsLoading(true);
      fetchData(appName);

      return () => {
        fetchData.cancel();
      };
    }
  }, [fetchData, appName, step]);

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setStep('selectAction');
  };

  const handleActionToggle = (action) => {
    const newSelectedActions = new Set(selectedActions);
    if (newSelectedActions.has(action.key)) {
      newSelectedActions.delete(action.key);
    } else {
      newSelectedActions.add(action.key);
    }
    setSelectedActions(newSelectedActions);
  };

  const handleAddSelectedActions = async () => {
    const requiresConnection = selectedApp?.supportsConnections;

    if (selectedActions.size === 0 || (requiresConnection && !selectedConnection)) {
      return;
    }

    try {
      const selectedActionsArray = Array.from(selectedActions);

      const payload = {
        type: 'app',
        appKey: selectedApp.key,
        actions: selectedActionsArray,
      };

      if (requiresConnection && selectedConnection) {
        payload.connectionId = selectedConnection.id;
      }

      console.log('Creating agent tool with data:', payload);
      await createAgentTool(payload);

      onClose();
    } catch (error) {
      console.error('Failed to create agent tool:', error);
    }
  };

  const handleBackToApps = () => {
    setSelectedApp(null);
    setSelectedActions(new Set());
    setSelectedConnection(null);
    setStep('selectApp');
  };

  const handleSelectAll = () => {
    if (selectedActions.size === actions?.data?.length) {
      setSelectedActions(new Set());
    } else {
      const allActionKeys = new Set(actions?.data?.map(action => action.key) || []);
      setSelectedActions(allActionKeys);
    }
  };

  const isAllSelected = selectedActions.size === actions?.data?.length && actions?.data?.length > 0;

  const connectionOptions = React.useMemo(() => {
    return connections?.data?.map(connection => ({
      label: connection?.formattedData?.screenName ?? 'Unnamed',
      value: connection?.id,
      connection: connection
    })) || [];
  }, [connections?.data]);

  const selectedConnectionOption = connectionOptions.find(option => option.value === selectedConnection?.id) || null;

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '70vh',
        },
      }}
      data-test="add-agent-action-dialog"
    >
      <DialogTitle>
        {step === 'selectApp'
          ? formatMessage('addAgentActionDialog.title')
          : formatMessage('addAgentActionDialog.selectAction')
        }
      </DialogTitle>

      {step === 'selectApp' && (
        <>
          <Box px={3}>
            <FormControl
              variant="outlined"
              fullWidth
              size={matchSmallScreens ? 'small' : 'medium'}
            >
              <InputLabel htmlFor="search-app">
                {formatMessage('addAgentActionDialog.searchApp')}
              </InputLabel>

              <OutlinedInput
                id="search-app"
                type="text"
                fullWidth
                autoFocus
                onChange={(event) => setAppName(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon
                      sx={{ color: (theme) => theme.palette.primary.main }}
                    />
                  </InputAdornment>
                }
                label={formatMessage('addAgentActionDialog.searchApp')}
                inputProps={{
                  'data-test': 'search-for-app-text-field',
                }}
              />
            </FormControl>
          </Box>

          <DialogContent>
            <List sx={{ pt: 2, width: '100%' }}>
              {isLoading && (
                <CircularProgress
                  data-test="search-for-app-loader"
                  sx={{ display: 'block', margin: '20px auto' }}
                />
              )}

              {!isLoading &&
                apps?.data.map((app) => (
                  <ListItem disablePadding key={app.name} data-test="app-list-item">
                    <ListItemButton
                      onClick={() => handleAppSelect(app)}
                    >
                      <ListItemIcon sx={{ minWidth: 74 }}>
                        <AppIcon
                          color={app.primaryColor}
                          url={app.iconUrl}
                          name={app.name}
                        />
                      </ListItemIcon>

                      <ListItemText
                        primary={app.name}
                        primaryTypographyProps={{
                          sx: { color: (theme) => theme.palette.text.primary },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </DialogContent>
        </>
      )}

      {step === 'selectAction' && (
        <>
          <Box px={3} pb={2}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <AppIcon
                  color={selectedApp.primaryColor}
                  url={selectedApp.iconUrl}
                  name={selectedApp.name}
                  size="small"
                />
                <Typography variant="h6">{selectedApp.name}</Typography>
              </Box>

              {actions?.data?.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleSelectAll}
                  data-test="select-all-button"
                >
                  {isAllSelected
                    ? formatMessage('addAgentActionDialog.unselectAll')
                    : formatMessage('addAgentActionDialog.selectAll')
                  }
                </Button>
              )}
            </Box>
          </Box>

          {selectedApp?.supportsConnections && (
            <Box px={3} pb={2}>
              <Autocomplete
                fullWidth
                loading={isConnectionsLoading}
                options={connectionOptions}
                value={selectedConnectionOption}
                onChange={(event, newValue) => {
                  setSelectedConnection(newValue?.connection || null);
                }}
                getOptionLabel={(option) => option?.label || ''}
                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={formatMessage('addAgentActionDialog.selectConnection')}
                    required
                    error={!selectedConnection && selectedActions.size > 0}
                    helperText={!selectedConnection && selectedActions.size > 0 ? formatMessage('addAgentActionDialog.connectionRequired') : ''}
                  />
                )}
                data-test="connection-autocomplete"
              />
            </Box>
          )}

          <DialogContent>
            <Box sx={{ pt: 0, width: '100%' }}>
              {isActionsLoading && (
                <CircularProgress
                  data-test="actions-loader"
                  sx={{ display: 'block', margin: '20px auto' }}
                />
              )}

              {!isActionsLoading &&
                actions?.data?.map((action) => (
                  <Card
                    key={action.key}
                    sx={{
                      mb: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        boxShadow: 2,
                        backgroundColor: (theme) => theme.palette.action.hover,
                      },
                      ...(selectedActions.has(action.key) && {
                        boxShadow: 2,
                        borderColor: (theme) => theme.palette.primary.main,
                        borderWidth: 2,
                        borderStyle: 'solid',
                      })
                    }}
                    onClick={() => handleActionToggle(action)}
                    data-test="action-card"
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Checkbox
                        checked={selectedActions.has(action.key)}
                        onChange={() => handleActionToggle(action)}
                        onClick={(e) => e.stopPropagation()}
                        sx={{ mt: -1 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 'bold',
                            mb: 0.5
                          }}
                        >
                          {action.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontWeight: 'normal' }}
                        >
                          {action.description}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          </DialogContent>
        </>
      )}

      {step === 'selectAction' && (
        <DialogActions>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToApps}
            data-test="back-to-apps-button"
          >
            {formatMessage('addAgentActionDialog.backToApps')}
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={onClose} data-test="cancel-button">
            {formatMessage('addAgentActionDialog.cancel')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSelectedActions}
            disabled={selectedActions.size === 0 || (selectedApp?.supportsConnections && !selectedConnection) || isCreatingTool}
            data-test="add-actions-button"
          >
            {isCreatingTool
              ? <CircularProgress size={20} />
              : `${formatMessage('addAgentActionDialog.add')} (${selectedActions.size})`
            }
          </Button>
        </DialogActions>
      )}

      {step === 'selectApp' && (
        <DialogActions>
          <Button onClick={onClose} data-test="cancel-button">
            {formatMessage('addAgentActionDialog.cancel')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

AddAgentActionDialog.propTypes = {
  agentId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
