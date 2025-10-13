import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import * as React from 'react';

import Container from 'components/Container';
import NoResultFound from 'components/NoResultFound';
import AgentRow from 'components/AgentRow/index.ee';
import AgentsButtons from 'components/AgentsButtons/index.ee';
import PageTitle from 'components/PageTitle';
import useFormatMessage from 'hooks/useFormatMessage';
import useAgents from 'hooks/useAgents.ee';

export default function Agents() {
  const formatMessage = useFormatMessage();
  const { data, isLoading: isAgentsLoading } = useAgents();

  const agents = data?.data || [];
  const pageInfo = data?.meta;
  const hasAgents = pageInfo?.count > 0;

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
            <PageTitle>{formatMessage('agentsPage.title')}</PageTitle>
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
            <AgentsButtons />
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isAgentsLoading && (
          <CircularProgress
            data-test="agents-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        {!isAgentsLoading && !hasAgents && (
          <NoResultFound text={formatMessage('agentsPage.noAgents')} />
        )}

        {!isAgentsLoading &&
          agents?.map((agent) => <AgentRow key={agent.id} agent={agent} />)}
      </Container>
    </Box>
  );
}
