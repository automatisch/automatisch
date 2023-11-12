import * as React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';

import * as URLS from 'config/urls';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import RoleList from 'components/RoleList/index.ee';
import ConditionalIconButton from 'components/ConditionalIconButton';
import useFormatMessage from 'hooks/useFormatMessage';

function RolesPage() {
  const formatMessage = useFormatMessage();

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center">
            <PageTitle data-test="roles-page-title">
              {formatMessage('rolesPage.title')}
            </PageTitle>
          </Grid>

          <Grid container item xs="auto" sm="auto" alignItems="center">
            <ConditionalIconButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to={URLS.CREATE_ROLE}
              fullWidth
              icon={<AddIcon />}
              data-test="create-role"
            >
              {formatMessage('rolesPage.createRole')}
            </ConditionalIconButton>
          </Grid>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <RoleList />
        </Grid>
      </Grid>
    </Container>
  );
}

export default RolesPage;
