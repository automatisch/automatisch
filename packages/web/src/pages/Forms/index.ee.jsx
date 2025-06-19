import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import * as React from 'react';
import { Link } from 'react-router-dom';

import Container from 'components/Container';
import FormRow from 'components/FormRow/index.ee';
import NoResultFound from 'components/NoResultFound';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';
import useForms from 'hooks/useForms.ee';

export default function Forms() {
  const formatMessage = useFormatMessage();
  const { data, isLoading: isFormsLoading } = useForms();
  const currentUserAbility = useCurrentUserAbility();
  const canManageFlow = currentUserAbility.can('manage', 'Flow');

  const forms = data?.data || [];
  const pageInfo = data?.meta;
  const hasForms = pageInfo?.count > 0;

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
            <PageTitle>{formatMessage('formsPage.title')}</PageTitle>
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
              component={Link}
              disabled={!canManageFlow}
              startIcon={<AddIcon />}
              to={URLS.CREATE_FORM}
              data-test="create-form-button"
            >
              {formatMessage('formsPage.createForm')}
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ mt: [2, 0], mb: 2 }} />

        {isFormsLoading && (
          <CircularProgress
            data-test="forms-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        {!isFormsLoading && !hasForms && (
          <NoResultFound text={formatMessage('formsPage.noForms')} />
        )}

        {!isFormsLoading &&
          forms?.map((form) => <FormRow key={form.id} form={form} />)}
      </Container>
    </Box>
  );
}
