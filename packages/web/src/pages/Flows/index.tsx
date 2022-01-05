import * as React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';

import FlowRow from 'components/FlowRow';
import ConditionalIconButton from 'components/ConditionalIconButton';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import SearchInput from 'components/SearchInput';
import useFormatMessage from 'hooks/useFormatMessage'
import { GET_FLOWS } from 'graphql/queries/get-flows';
import * as URLS from 'config/urls';
import type { Flow } from 'types/flow';

export default function Flows() {
  const formatMessage = useFormatMessage();
  const [flowName, setFlowName] = React.useState('');
  const { data } = useQuery(GET_FLOWS);

  const flows: Flow[] = data?.getFlows?.filter((flow: Flow) => flow.name?.toLowerCase().includes(flowName.toLowerCase()));

  const onSearchChange = React.useCallback((event) => {
    setFlowName(event.target.value);
  }, []);

  const CreateFlowLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'to'>>(function InlineLink(
        linkProps,
        ref,
      ) {
        return <Link ref={ref} to={URLS.CREATE_FLOW} {...linkProps} />;
      }),
    [],
  );

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <Grid container sx={{ mb: [2, 5] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('flows.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>

          <Grid container item xs="auto" sm="auto" alignItems="center" order={{ xs: 1, sm: 2 }}>
            <ConditionalIconButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              component={CreateFlowLink}
              fullWidth
              icon={<AddIcon />}
            >
              {formatMessage('flows.create')}
            </ConditionalIconButton>
          </Grid>
        </Grid>

        {flows?.map((flow) => (<FlowRow key={flow.id} flow={flow} />))}
      </Container>
    </Box>
  );
};
