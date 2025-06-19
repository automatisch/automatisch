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
  const {
    mutateAsync: createFlow,
    isError,
    isPending,
    error,
  } = useCreateFlow();

  const navigateToEditor = (flowId) =>
    navigate(URLS.FLOW_EDITOR(flowId), { replace: true });

  React.useEffect(() => {
    async function initiate() {
      try {
        const templateId = searchParams.get('templateId');
        const response = await createFlow({ templateId });

        const flowId = response.data?.id;

        navigateToEditor(flowId);
      } catch (error) {
        console.error(error);
      }
    }

    initiate();
  }, [createFlow, navigate, searchParams]);

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
      {isPending && (
        <>
          <CircularProgress size={16} thickness={7.5} />
          <Typography variant="body2">
            {formatMessage('createFlow.creating')}
          </Typography>{' '}
        </>
      )}
      {isError && (
        <Typography variant="body2">
          {error?.message || formatMessage('genericError')}
        </Typography>
      )}
    </Box>
  );
}
