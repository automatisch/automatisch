import { useMutation } from '@apollo/client';
import { IRole, IUser } from '@automatisch/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Can from 'components/Can';
import Container from 'components/Container';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import { CREATE_USER } from 'graphql/mutations/create-user.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles.ee';

function generateRoleOptions(roles: IRole[]) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

export default function CreateUser(): React.ReactElement {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const { roles, loading: rolesLoading } = useRoles();
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleUserCreation = async (userData: Partial<IUser>) => {
    try {
      await createUser({
        variables: {
          input: {
            fullName: userData.fullName,
            password: userData.password,
            email: userData.email,
            role: {
              id: userData.role?.id,
            },
          },
        },
      });

      enqueueSnackbar(formatMessage('createUser.successfullyCreated'), {
        variant: 'success',
        persist: true,
        SnackbarProps: {
          'data-test': 'snackbar-create-user-success',
        },
      });

      navigate(URLS.USERS);
    } catch (error) {
      throw new Error('Failed while creating!');
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle data-test="create-user-title">
            {formatMessage('createUserPage.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form onSubmit={handleUserCreation}>
            <Stack direction="column" gap={2}>
              <TextField
                required={true}
                name="fullName"
                label={formatMessage('userForm.fullName')}
                data-test="full-name-input"
                fullWidth
              />

              <TextField
                required={true}
                name="email"
                label={formatMessage('userForm.email')}
                data-test="email-input"
                fullWidth
              />

              <TextField
                required={true}
                name="password"
                label={formatMessage('userForm.password')}
                type="password"
                data-test="password-input"
                fullWidth
              />

              <Can I="update" a="Role">
                <ControlledAutocomplete
                  name="role.id"
                  fullWidth
                  disablePortal
                  disableClearable={true}
                  options={generateRoleOptions(roles)}
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      label={formatMessage('userForm.role')}
                    />
                  )}
                  loading={rolesLoading}
                />
              </Can>

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={loading}
                data-test="create-button"
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
