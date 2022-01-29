import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import Container from 'components/Container';
import Editor from 'components/Editor';
import useFormatMessage from 'hooks/useFormatMessage';
import { GET_FLOW } from 'graphql/queries/get-flow';
import type { Flow } from 'types/flow';
import * as URLS from 'config/urls';

export default function EditorLayout(): React.ReactElement {
  const { flowId } = useParams();
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_FLOW, { variables: { id: flowId }});
  const flow: Flow = data?.getFlow;

  return (
    <>
      <Stack direction="column" height="100%">
        <Stack direction="row" bgcolor="white" justifyContent="space-between" alignItems="center" boxShadow={1} py={1} px={1}>
          <Box display="flex" flex={1} alignItems="center">
            <IconButton
              size="small"
              component={Link}
              to={URLS.APPS}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <Typography variant="body1" noWrap sx={{ display: 'flex', flex: 1, maxWidth: '50vw' }}>
              {flow?.name}
            </Typography>
          </Box>

          <Box pr={1}>
            <FormControlLabel
              control={
                <Switch checked={flow?.active} />
              }
              label={flow?.active ? formatMessage('flow.active') : formatMessage('flow.inactive')}
              labelPlacement="start"
            />
          </Box>
        </Stack>

        <Container maxWidth="md">
          {!flow && 'not found'}

          {flow && <Editor flow={flow} />}
        </Container>
      </Stack>
    </>
  )
}
