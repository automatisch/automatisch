import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateFlow from 'hooks/useCreateFlow';
import Box from '@mui/material/Box';

export default function CreateFlow() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const { mutateAsync: createFlow, isError } = useCreateFlow();

  React.useEffect(() => {
    async function initiate() {
      const response = await createFlow();

      const flowId = response.data?.id;

      navigate(URLS.FLOW_EDITOR(flowId), { replace: true });
    }

    initiate();
  }, [createFlow, navigate]);

  if (isError) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={16} thickness={7.5} />
      <Typography variant="body2">
        {formatMessage('createFlow.creating')}
      </Typography>
    </Box>
  );
}
