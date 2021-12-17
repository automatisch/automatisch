import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { CREATE_FLOW } from 'graphql/mutations/create-flow';

import Box from '@mui/material/Box';

export default function CreateFlow() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [createFlow] = useMutation(CREATE_FLOW);

  React.useEffect(() => {
    async function initiate() {
      const response = await createFlow();
      const flowId = response.data?.createFlow?.id;

      setTimeout(() => {
        navigate(URLS.FLOW(flowId));
      }, 1234);
    }

    initiate();
  }, [createFlow, navigate]);

  return (
    <Box sx={{ display: 'flex', flex: 1, height: '100vh', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={16} thickness={7.5} />

      <Typography variant="body2">
        {formatMessage('createFlow.creating')}
      </Typography>
    </Box>
  )
}
