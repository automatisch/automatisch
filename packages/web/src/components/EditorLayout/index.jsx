import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Snackbar from '@mui/material/Snackbar';
import { ReactFlowProvider } from 'reactflow';

import { EditorProvider } from 'contexts/Editor';
import EditableTypography from 'components/EditableTypography';
import Container from 'components/Container';
import Editor from 'components/Editor';
import Can from 'components/Can';
import useFormatMessage from 'hooks/useFormatMessage';
import { UPDATE_FLOW_STATUS } from 'graphql/mutations/update-flow-status';
import { UPDATE_FLOW } from 'graphql/mutations/update-flow';
import * as URLS from 'config/urls';
import { TopBar } from './style';
import useFlow from 'hooks/useFlow';
import { useQueryClient } from '@tanstack/react-query';
import EditorNew from 'components/EditorNew/EditorNew';

const useNewFlowEditor = process.env.REACT_APP_USE_NEW_FLOW_EDITOR === 'true';

export default function EditorLayout() {
  const { flowId } = useParams();
  const formatMessage = useFormatMessage();
  const [updateFlow] = useMutation(UPDATE_FLOW);
  const [updateFlowStatus] = useMutation(UPDATE_FLOW_STATUS);
  const { data, isLoading: isFlowLoading } = useFlow(flowId);
  const flow = data?.data;
  const queryClient = useQueryClient();

  const onFlowNameUpdate = React.useCallback(
    async (name) => {
      try {
        await updateFlow({
          variables: {
            input: {
              id: flowId,
              name,
            },
          },
        });

        await queryClient.invalidateQueries({ queryKey: ['flows', flowId] });
      } catch (e) {}
    },
    [flowId, queryClient],
  );

  const onFlowStatusUpdate = React.useCallback(
    async (active) => {
      try {
        await updateFlowStatus({
          variables: {
            input: {
              id: flowId,
              active,
            },
          },
        });

        await queryClient.invalidateQueries({ queryKey: ['flows', flowId] });
      } catch (err) {}
    },
    [flowId, queryClient],
  );

  return (
    <>
      <TopBar
        direction="row"
        bgcolor="white"
        justifyContent="space-between"
        alignItems="center"
        boxShadow={1}
        py={1}
        px={1}
        className="mui-fixed"
      >
        <Box display="flex" flex={1} alignItems="center">
          <Tooltip
            placement="right"
            title={formatMessage('flowEditor.goBack')}
            disableInteractive
          >
            <IconButton
              size="small"
              component={Link}
              to={URLS.FLOWS}
              data-test="editor-go-back-button"
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {!isFlowLoading && (
            <EditableTypography
              variant="body1"
              onConfirm={onFlowNameUpdate}
              noWrap
              sx={{ display: 'flex', flex: 1, maxWidth: '50vw', ml: 2 }}
            >
              {flow?.name}
            </EditableTypography>
          )}
        </Box>

        <Box pr={1}>
          <Can I="publish" a="Flow" passThrough>
            {(allowed) => (
              <Button
                disabled={!allowed || !flow}
                variant="contained"
                size="small"
                onClick={() => onFlowStatusUpdate(!flow.active)}
                data-test={
                  flow?.active ? 'unpublish-flow-button' : 'publish-flow-button'
                }
              >
                {flow?.active
                  ? formatMessage('flowEditor.unpublish')
                  : formatMessage('flowEditor.publish')}
              </Button>
            )}
          </Can>
        </Box>
      </TopBar>

      {useNewFlowEditor ? (
        <Stack direction="column" height="100%" flexGrow={1}>
          <Stack direction="column" flexGrow={1}>
            <EditorProvider value={{ readOnly: !!flow?.active }}>
              <ReactFlowProvider>
                {!flow && !isFlowLoading && 'not found'}
                {flow && <EditorNew flow={flow} />}
              </ReactFlowProvider>
            </EditorProvider>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="column" height="100%">
          <Container maxWidth="md">
            <EditorProvider value={{ readOnly: !!flow?.active }}>
              {!flow && !isFlowLoading && 'not found'}
              {flow && <Editor flow={flow} />}
            </EditorProvider>
          </Container>
        </Stack>
      )}

      <Snackbar
        data-test="flow-cannot-edit-info-snackbar"
        open={!!flow?.active}
        message={formatMessage('flowEditor.publishedFlowCannotBeUpdated')}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        ContentProps={{ sx: { fontWeight: 300 } }}
        action={
          <Button
            variant="contained"
            size="small"
            onClick={() => onFlowStatusUpdate(!flow.active)}
            data-test="unpublish-flow-from-snackbar"
          >
            {formatMessage('flowEditor.unpublish')}
          </Button>
        }
      />
    </>
  );
}
