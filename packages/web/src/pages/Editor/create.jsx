import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateFlow from 'hooks/useCreateFlow';
import Box from '@mui/material/Box';

export default function CreateFlow() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [searchParams] = useSearchParams();
  const { mutateAsync: createFlow, isCreateFlowError } = useCreateFlow();

  const navigateToEditor = (flowId) =>
    navigate(URLS.FLOW_EDITOR(flowId), { replace: true });

  React.useEffect(() => {
    async function initiate() {
      const templateId = searchParams.get('templateId');
      const response = await createFlow({ templateId });

      const flowId = response.data?.id;

      navigateToEditor(flowId);
    }

    initiate();
  }, [createFlow, navigate, searchParams]);

  if (isCreateFlowError) {
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
