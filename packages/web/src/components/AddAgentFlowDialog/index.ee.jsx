import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import FlowAppIcons from 'components/FlowAppIcons';
import useFormatMessage from 'hooks/useFormatMessage';
import useFlows from 'hooks/useFlows';
import useCreateAgentTool from 'hooks/useCreateAgentTool.ee';

export default function AddAgentFlowDialog({ agentId, onClose }) {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('sm'));
  const formatMessage = useFormatMessage();
  const [flowName, setFlowName] = React.useState('');
  const [selectedFlows, setSelectedFlows] = React.useState(new Set());

  const { data: flows, isLoading } = useFlows({
    flowName,
    onlyOwnedFlows: true,
  });

  const { mutateAsync: createAgentTool, isLoading: isCreatingTool } = useCreateAgentTool(agentId);

  const handleFlowToggle = (flow) => {
    const newSelectedFlows = new Set(selectedFlows);
    if (newSelectedFlows.has(flow.id)) {
      newSelectedFlows.delete(flow.id);
    } else {
      newSelectedFlows.add(flow.id);
    }
    setSelectedFlows(newSelectedFlows);
  };

  const handleAddSelectedFlows = async () => {
    if (selectedFlows.size === 0) {
      return;
    }

    try {
      // Create agent tools for all selected flows
      const promises = Array.from(selectedFlows).map(flowId => {
        const payload = {
          type: 'flow',
          flowId: flowId,
        };
        console.log('Creating agent flow tool with data:', payload);
        return createAgentTool(payload);
      });

      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error('Failed to create agent tools:', error);
    }
  };

  const handleSearchChange = (event) => {
    setFlowName(event.target.value);
  };

  const filteredFlows = React.useMemo(() => {
    const allFlows = flows?.data || [];

    // Only show published flows for agent tools
    const filtered = allFlows.filter(flow => {
      const isPublished = flow.status === 'published';
      return isPublished;
    });

    return filtered;
  }, [flows]);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={matchSmallScreens}
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '70vh',
        },
      }}
      data-test="add-agent-flow-dialog"
    >
      <DialogTitle>
        {formatMessage('addAgentFlowDialog.title')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="flow-search">
              {formatMessage('addAgentFlowDialog.searchFlow')}
            </InputLabel>
            <OutlinedInput
              id="flow-search"
              type="text"
              value={flowName}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              label={formatMessage('addAgentFlowDialog.searchFlow')}
              autoFocus
              inputProps={{
                'data-test': 'search-for-flow-text-field',
              }}
            />
          </FormControl>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress data-test="flows-loader" />
            </Box>
          )}

          {!isLoading && filteredFlows.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
              {flowName
                ? formatMessage('addAgentFlowDialog.noFlowsFound')
                : formatMessage('addAgentFlowDialog.noPublishedFlows')
              }
            </Typography>
          )}

          {!isLoading && filteredFlows.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {formatMessage('addAgentFlowDialog.selectFlow')}
              </Typography>

              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {filteredFlows.map((flow) => (
                  <ListItem key={flow.id} disablePadding>
                    <Card
                      sx={{
                        width: '100%',
                        mb: 1,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          boxShadow: 2,
                          backgroundColor: (theme) => theme.palette.action.hover,
                        },
                        ...(selectedFlows.has(flow.id) && {
                          boxShadow: 2,
                          borderColor: (theme) => theme.palette.primary.main,
                          borderWidth: 2,
                          borderStyle: 'solid',
                        })
                      }}
                      onClick={() => handleFlowToggle(flow)}
                      data-test="flow-card"
                    >
                      <ListItemButton
                        selected={selectedFlows.has(flow.id)}
                        sx={{ p: 0 }}
                      >
                        <CardContent sx={{
                          flex: 1,
                          py: 1.5,
                          '&:last-child': { pb: 1.5 },
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 2
                        }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedFlows.has(flow.id)}
                                onChange={() => handleFlowToggle(flow)}
                                onClick={(e) => e.stopPropagation()}
                                sx={{ mt: -1 }}
                              />
                            }
                            sx={{ mr: 0, alignSelf: 'flex-start' }}
                            label=""
                          />

                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="subtitle1"
                              component="div"
                              sx={{
                                fontWeight: 'bold',
                                mb: 1
                              }}
                            >
                              {flow.name}
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FlowAppIcons steps={flow.steps} />
                            </Box>
                          </Box>
                        </CardContent>
                      </ListItemButton>
                    </Card>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isCreatingTool} data-test="cancel-button">
          {formatMessage('addAgentFlowDialog.cancel')}
        </Button>
        <Button
          onClick={handleAddSelectedFlows}
          variant="contained"
          disabled={selectedFlows.size === 0 || isCreatingTool}
          data-test="add-flows-button"
        >
          {isCreatingTool ? (
            <CircularProgress size={20} />
          ) : (
            `${formatMessage('addAgentFlowDialog.add')} (${selectedFlows.size})`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddAgentFlowDialog.propTypes = {
  agentId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
