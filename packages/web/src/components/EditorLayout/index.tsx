import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import Editor from 'components/Editor';
import useFormatMessage from 'hooks/useFormatMessage';
import { GET_FLOW } from 'graphql/queries/get-flow';
import type { Flow } from 'types/flow';

type EditorLayoutProps = {
  children?: React.ReactNode;
}

export default function EditorLayout(props: EditorLayoutProps) {
  const { flowId } = useParams();
  const formatMessage = useFormatMessage();
  const { data } = useQuery(GET_FLOW, { variables: { id: flowId }});
  const flow: Flow = data?.getFlow;

  return (
    <>
      <Stack direction="column" height="100%">
        <Stack direction="row" bgcolor="white" justifyContent="space-between" alignItems="center" boxShadow={1} py={1} px={1}>
          <Box display="flex" flex={1} alignItems="center">
            <IconButton size="small">
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <Typography variant="body1" noWrap sx={{ width: 300, maxWidth: '300px '}}>
              {flow?.name}
            </Typography>
          </Box>

          <Box pr={1}>
            <FormControlLabel
              control={
                <Switch checked={false} />
              }
              label={formatMessage('flow.inactive')}
              labelPlacement="start"
            />
          </Box>
        </Stack>

        <Box display="flex" flex="1" flexDirection="column">
          {!flow && 'not found'}

          {flow && <Editor flow={flow} />}
        </Box>
      </Stack>
    </>
  )
}