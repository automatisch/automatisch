import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

import useFormatMessage from 'hooks/useFormatMessage';
import useMcpServer from 'hooks/useMcpServer.ee';
import useRotateMcpServerToken from 'hooks/useRotateMcpServerToken.ee';

export default function McpServerConnect({ mcpServerId }) {
  const formatMessage = useFormatMessage();
  const [showToken, setShowToken] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { data } = useMcpServer(mcpServerId);
  const rotateTokenMutation = useRotateMcpServerToken(mcpServerId);

  const mcpServer = data?.data;
  const serverUrl = mcpServer?.serverUrl || '';

  const getDisplayUrl = () => {
    if (!serverUrl) return '';
    if (showToken) return serverUrl;

    return serverUrl.replace(
      /\/mcp\/[^/]+$/,
      '/mcp/••••••••••••••••••••••••••••••••••••',
    );
  };

  const handleToggleTokenVisibility = () => {
    setShowToken(!showToken);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(serverUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleRotateToken = () => {
    rotateTokenMutation.mutate();
  };

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {formatMessage('mcpServerConnect.title')}
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}
              >
                <CheckCircleIcon color="success" fontSize="small" />
                <Typography variant="subtitle1">
                  {formatMessage('mcpServerConnect.serverUrl')}
                </Typography>
              </Box>

              <TextField
                fullWidth
                value={getDisplayUrl()}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip
                        title={
                          showToken
                            ? formatMessage('mcpServerConnect.hideToken')
                            : formatMessage('mcpServerConnect.showToken')
                        }
                      >
                        <IconButton
                          onClick={handleToggleTokenVisibility}
                          edge="end"
                          sx={{ mr: 0.5 }}
                        >
                          {showToken ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={formatMessage('mcpServerConnect.copyUrl')}
                      >
                        <IconButton onClick={handleCopyUrl} edge="end">
                          <ContentCopyIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                helperText={formatMessage('mcpServerConnect.description')}
              />
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                {formatMessage('mcpServerConnect.tokenManagement')}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRotateToken}
                disabled={rotateTokenMutation.isPending}
              >
                {rotateTokenMutation.isPending
                  ? formatMessage('mcpServerConnect.rotatingToken')
                  : formatMessage('mcpServerConnect.rotateToken')}
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {copySuccess && (
        <Alert severity="success">
          {formatMessage('mcpServerConnect.urlCopied')}
        </Alert>
      )}

      {rotateTokenMutation.isError && (
        <Alert severity="error">
          {formatMessage('mcpServerConnect.rotateTokenError')}
        </Alert>
      )}

      {rotateTokenMutation.isSuccess && (
        <Alert severity="success">
          {formatMessage('mcpServerConnect.tokenRotateSuccess')}
        </Alert>
      )}
    </Stack>
  );
}

McpServerConnect.propTypes = {
  mcpServerId: PropTypes.string.isRequired,
};
