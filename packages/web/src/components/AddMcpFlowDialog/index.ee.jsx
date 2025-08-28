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
import useCreateMcpTool from 'hooks/useCreateMcpTool.ee';

export default function AddMcpFlowDialog({ mcpServerId, onClose }) {
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('sm'));
  const formatMessage = useFormatMessage();
  const [flowName, setFlowName] = React.useState('');
  const [selectedFlows, setSelectedFlows] = React.useState(new Set());

  const { data: flows, isLoading } = useFlows({
    flowName,
    onlyOwnedFlows: true,
  });

  const { mutateAsync: createMcpTool, isLoading: isCreatingTool } = useCreateMcpTool(mcpServerId);

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
      // Create MCP tools for all selected flows
      const promises = Array.from(selectedFlows).map(flowId => {
        const payload = {
          type: 'flow',
          flowId: flowId,
        };
        return createMcpTool(payload);
      });

      await Promise.all(promises);
      onClose();
    } catch (error) {
      console.error('Failed to create MCP tools:', error);
    }
  };

  const handleSearchChange = (event) => {
    setFlowName(event.target.value);
  };


  const filteredFlows = React.useMemo(() => {
    const allFlows = flows?.data || [];
    
    // Only show published flows that have MCP triggers
    const filtered = allFlows.filter(flow => {
      const isPublished = flow.status === 'published';
      const hasMcpTrigger = flow.steps?.some(step => 
        step.appKey === 'mcp' && step.key === 'mcpTool'
      );
      return isPublished && hasMcpTrigger;
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
    >
      <DialogTitle>
        {formatMessage('addMcpFlowDialog.title')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="flow-search">
              {formatMessage('addMcpFlowDialog.searchFlow')}
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
              label={formatMessage('addMcpFlowDialog.searchFlow')}
            />
          </FormControl>

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {!isLoading && filteredFlows.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
              {flowName 
                ? formatMessage('addMcpFlowDialog.noFlowsFound')
                : formatMessage('addMcpFlowDialog.noMcpFlows')
              }
            </Typography>
          )}

          {!isLoading && filteredFlows.length > 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {formatMessage('addMcpFlowDialog.selectFlow')}
              </Typography>
              
              <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                {filteredFlows.map((flow) => (
                  <ListItem key={flow.id} disablePadding>
                    <Card sx={{ width: '100%', mb: 1 }}>
                      <ListItemButton
                        onClick={() => handleFlowToggle(flow)}
                        selected={selectedFlows.has(flow.id)}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={selectedFlows.has(flow.id)}
                              onChange={() => handleFlowToggle(flow)}
                            />
                          }
                          sx={{ mr: 2 }}
                          label=""
                        />
                        <CardContent sx={{ flex: 1, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="h6" component="div">
                              {flow.name}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FlowAppIcons steps={flow.steps} />
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
        <Button onClick={onClose} disabled={isCreatingTool}>
          {formatMessage('addMcpFlowDialog.cancel')}
        </Button>
        <Button
          onClick={handleAddSelectedFlows}
          variant="contained"
          disabled={selectedFlows.size === 0 || isCreatingTool}
        >
          {isCreatingTool ? (
            <CircularProgress size={24} />
          ) : (
            `${formatMessage('addMcpFlowDialog.add')} (${selectedFlows.size})`
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddMcpFlowDialog.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};