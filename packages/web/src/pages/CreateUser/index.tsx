import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { IUser, IRole } from '@automatisch/types';

import { CREATE_USER } from 'graphql/mutations/create-user.ee';
import * as URLS from 'config/urls';
import useRoles from 'hooks/useRoles.ee';
import PageTitle from 'components/PageTitle';
import Form from 'components/Form';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

function generateRoleOptions(roles: IRole[]) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

export default function CreateUser(): React.ReactElement {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const { roles, loading: rolesLoading } = useRoles();

  const handleUserCreation = async (userData: Partial<IUser>) => {
    await createUser({
      variables: {
        input: {
          fullName: userData.fullName,
          password: userData.password,
          email: userData.email,
          role: {
            id: userData.role?.id
          }
        }
      }
    });

    navigate(URLS.USERS);
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('createUserPage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form onSubmit={handleUserCreation}>
            <Stack direction="column" gap={2}>
              <TextField
                required={true}
                name="fullName"
                label={formatMessage('userForm.fullName')}
                fullWidth
              />

              <TextField
                required={true}
                name="email"
                label={formatMessage('userForm.email')}
                fullWidth
              />

              <TextField
                required={true}
                name="password"
                label={formatMessage('userForm.password')}
                type="password"
                fullWidth
              />

              <ControlledAutocomplete
                name="role.id"
                fullWidth
                disablePortal
                disableClearable={true}
                options={generateRoleOptions(roles)}
                renderInput={(params) => <MuiTextField {...params} label={formatMessage('userForm.role')} />}
                loading={rolesLoading}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={loading}
              >
                {formatMessage('createUser.submit')}
              </LoadingButton>
            </Stack>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}
