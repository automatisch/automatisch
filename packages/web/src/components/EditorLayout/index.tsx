import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import EditableTypography from 'components/EditableTypography';
import Container from 'components/Container';
import Editor from 'components/Editor';
import useFormatMessage from 'hooks/useFormatMessage';
import { UPDATE_FLOW_STATUS } from 'graphql/mutations/update-flow-status';
import { UPDATE_FLOW } from 'graphql/mutations/update-flow';
import { GET_FLOW } from 'graphql/queries/get-flow';
import type { IFlow } from '@automatisch/types';
import * as URLS from 'config/urls';

export default function EditorLayout(): React.ReactElement {
  const { flowId } = useParams();
  const formatMessage = useFormatMessage();
  const [updateFlow] = useMutation(UPDATE_FLOW);
  const [updateFlowStatus] = useMutation(UPDATE_FLOW_STATUS);
  const { data, loading } = useQuery(GET_FLOW, { variables: { id: flowId }});
  const flow: IFlow = data?.getFlow;

  const onFlowNameUpdate = React.useCallback(async (name: string) => {
    await updateFlow({
      variables: {
        input: {
          id: flowId,
          name,
        },
      },
      optimisticResponse: {
        updateFlow: {
          __typename:  'Flow',
          id: flow?.id,
          name,
        }
      }
    });
  }, [flow?.id]);

  const onFlowStatusUpdate = React.useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const active = event.target.checked;

    await updateFlowStatus({
      variables: {
        input: {
          id: flowId,
          active,
        },
      },
      optimisticResponse: {
        updateFlowStatus: {
          __typename:  'Flow',
          id: flow?.id,
          active,
        }
      }
    });
  }, [flow?.id]);

  return (
    <>
      <Stack direction="column" height="100%">
        <Stack direction="row" bgcolor="white" justifyContent="space-between" alignItems="center" boxShadow={1} py={1} px={1}>
          <Box display="flex" flex={1} alignItems="center">
            <Tooltip placement="right" title={formatMessage('flowEditor.goBack')} disableInteractive>
              <IconButton
                size="small"
                component={Link}
                to={URLS.FLOWS}
              >
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {!loading && (
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
            <FormControlLabel
              control={
                <Switch checked={flow?.active ?? false} onChange={onFlowStatusUpdate} />
              }
              label={flow?.active ? formatMessage('flow.active') : formatMessage('flow.inactive')}
              labelPlacement="start"
            />
          </Box>
        </Stack>

        <Container maxWidth="md">
          {!flow && !loading && 'not found'}

          {flow && <Editor flow={flow} />}
        </Container>
      </Stack>
    </>
  )
}
