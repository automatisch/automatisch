import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import NoResultFound from 'components/NoResultFound';
import McpServerRow from 'components/McpServerRow/index.ee';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';
import useMcpServers from 'hooks/useMcpServers.ee';
import useCreateMcpServer from 'hooks/useCreateMcpServer.ee';

export default function Forms() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const { data, isLoading: isMcpServersLoading } = useMcpServers();
  const { mutateAsync: createMcpServer } = useCreateMcpServer();
  const currentUserAbility = useCurrentUserAbility();
  const canManageFlow = currentUserAbility.can('manage', 'Flow');

  const mcpServers = data?.data || [];
  const pageInfo = data?.meta;
  const hasMcpServers = pageInfo?.count > 0;

  async function handleCreatingMcpServer() {
    const { data: mcpServer } = await createMcpServer();

    navigate(URLS.MCP_SERVER(mcpServer.id));
  }

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid
            container
            item
            xs
            sm
            alignItems="center"
            order={{ xs: 0, height: 80 }}
          >
            <PageTitle>{formatMessage('mcpServersPage.title')}</PageTitle>
          </Grid>

          <Grid
            container
            item
            display="flex"
            direction="row"
            xs="auto"
            sm="auto"
            gap={1}
            alignItems="center"
            order={{ xs: 1 }}
          >
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={!canManageFlow}
              startIcon={<AddIcon />}
              onClick={handleCreatingMcpServer}
              data-test="create-mcp-server-button"
            >
              {formatMessage('mcpServersPage.createMcpServer')}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isMcpServersLoading && (
          <CircularProgress
            data-test="forms-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        {!isMcpServersLoading && !hasMcpServers && (
          <NoResultFound text={formatMessage('mcpServersPage.noMcpServers')} />
        )}

        {!isMcpServersLoading &&
          mcpServers?.map((mcpServer) => (
            <McpServerRow key={mcpServer.id} mcpServer={mcpServer} />
          ))}
      </Container>
    </Box>
  );
}
