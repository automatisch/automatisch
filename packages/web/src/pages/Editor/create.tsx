import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import { CREATE_FLOW } from 'graphql/mutations/create-flow';

import Box from '@mui/material/Box';

export default function CreateFlow(): React.ReactElement {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [createFlow] = useMutation(CREATE_FLOW);

  const appKey = searchParams.get('appKey');

  React.useEffect(() => {
    async function initiate() {
      const response = await createFlow({
        variables: {
          input: {
            triggerAppKey: appKey,
          }
        }
      });
      const flowId = response.data?.createFlow?.id;

      navigate(URLS.FLOW_EDITOR(flowId));
    }

    initiate();
  }, [createFlow, navigate, appKey]);

  return (
    <Box sx={{ display: 'flex', flex: 1, height: '100vh', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={16} thickness={7.5} />

      <Typography variant="body2">
        {formatMessage('createFlow.creating')}
      </Typography>
    </Box>
  )
}
