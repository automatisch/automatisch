import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

import useFormatMessage from 'hooks/useFormatMessage';
import useTestAgent from 'hooks/useTestAgent.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';

function ChatMessage({ message, isUser }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        mb: 2,
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: isUser ? 'primary.main' : 'grey.300',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 18, color: 'white' }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
        )}
      </Box>
      <Paper
        sx={{
          p: 1.5,
          maxWidth: '75%',
          bgcolor: isUser ? 'primary.main' : 'grey.100',
          color: isUser ? 'white' : 'text.primary',
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {message.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 0.5,
            opacity: 0.7,
            color: isUser ? 'white' : 'text.secondary',
          }}
        >
          {new Date(message.timestamp).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
}

ChatMessage.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
};

export default function AgentChat({ agentId, messages, onMessagesChange }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: testAgent } = useTestAgent(agentId);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  const chatContainerRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      timestamp: Date.now(),
      isUser: true,
    };

    onMessagesChange((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Convert messages to the format expected by the API
      const apiMessages = [...messages, userMessage].map((msg) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Call the test agent API
      const response = await testAgent(apiMessages);

      const agentMessage = {
        id: `agent-${Date.now()}`,
        content: response.data.response,
        timestamp: Date.now(),
        isUser: false,
      };
      onMessagesChange((prev) => [...prev, agentMessage]);
    } catch (error) {
      enqueueSnackbar(
        error?.response?.data?.error || formatMessage('agent.chat.error'),
        {
          variant: 'error',
        },
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6">
          {formatMessage('agent.chat.title')}
        </Typography>
      </Box>

      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'background.white',
        }}
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isUser={message.isUser}
          />
        ))}
        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              {formatMessage('agent.chat.thinking')}
            </Typography>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={formatMessage('agent.chat.placeholder')}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            multiline
            maxRows={4}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

AgentChat.propTypes = {
  agentId: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      isUser: PropTypes.bool.isRequired,
    }),
  ),
  onMessagesChange: PropTypes.func,
};
