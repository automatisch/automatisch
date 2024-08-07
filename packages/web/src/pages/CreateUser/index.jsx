import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MuiTextField from '@mui/material/TextField';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';

import Can from 'components/Can';
import Container from 'components/Container';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import { CREATE_USER } from 'graphql/mutations/create-user.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles.ee';

function generateRoleOptions(roles) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

export default function CreateUser() {
  const formatMessage = useFormatMessage();
  const [createUser, { loading, data }] = useMutation(CREATE_USER);
  const { data: rolesData, loading: isRolesLoading } = useRoles();
  const roles = rolesData?.data;
  const enqueueSnackbar = useEnqueueSnackbar();
  const queryClient = useQueryClient();

  const handleUserCreation = async (userData) => {
    try {
      await createUser({
        variables: {
          input: {
            fullName: userData.fullName,
            email: userData.email,
            role: {
              id: userData.role?.id,
            },
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      enqueueSnackbar(formatMessage('createUser.successfullyCreated'), {
        variant: 'success',
        persist: true,
        SnackbarProps: {
          'data-test': 'snackbar-create-user-success',
        },
      });
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
                      required
                      label={formatMessage('userForm.role')}
                    />
                  )}
                  loading={isRolesLoading}
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

              {data && (
                <Alert
                  severity="info"
                  color="primary"
                  sx={{ fontWeight: '500' }}
                  data-test="invitation-email-info-alert"
                >
                  {formatMessage('createUser.invitationEmailInfo', {
                    link: () => (
                      <a
                        href={data.createUser.acceptInvitationUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {data.createUser.acceptInvitationUrl}
                      </a>
                    ),
                  })}
                </Alert>
              )}
            </Stack>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}
