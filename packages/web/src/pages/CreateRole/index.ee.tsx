import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { IRole } from '@automatisch/types';

import { CREATE_ROLE } from 'graphql/mutations/create-role.ee';
import * as URLS from 'config/urls';
import PageTitle from 'components/PageTitle';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

export default function CreateRole(): React.ReactElement {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [createRole, { loading }] = useMutation(CREATE_ROLE);

  const handleRoleCreation = async (roleData: Partial<IRole>) => {
    await createRole({
      variables: {
        input: {
          name: roleData.name,
          description: roleData.description,
        }
      }
    });

    navigate(URLS.ROLES);
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('createRolePage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form onSubmit={handleRoleCreation}>
            <Stack direction="column" gap={2}>
              <TextField
                required={true}
                name="name"
                label={formatMessage('roleForm.name')}
                fullWidth
              />

              <TextField
                required={true}
                name="description"
                label={formatMessage('roleForm.description')}
                fullWidth
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={loading}
              >
                {formatMessage('createRole.submit')}
              </LoadingButton>
            </Stack>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}
