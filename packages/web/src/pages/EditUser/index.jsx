import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import MuiTextField from '@mui/material/TextField';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Can from 'components/Can';
import Container from 'components/Container';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles.ee';
import useAdminUpdateUser from 'hooks/useAdminUpdateUser';
import useAdminUser from 'hooks/useAdminUser';

function generateRoleOptions(roles) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

export default function EditUser() {
  const formatMessage = useFormatMessage();
  const { userId } = useParams();
  const { mutateAsync: updateUser, isPending: isAdminUpdateUserPending } =
    useAdminUpdateUser(userId);
  const { data: userData, isLoading: isUserLoading } = useAdminUser({ userId });
  const user = userData?.data;
  const { data, isLoading: isRolesLoading } = useRoles();
  const roles = data?.data;
  const enqueueSnackbar = useEnqueueSnackbar();
  const navigate = useNavigate();

  const handleUserUpdate = async (userDataToUpdate) => {
    try {
      await updateUser({
        fullName: userDataToUpdate.fullName,
        email: userDataToUpdate.email,
        roleId: userDataToUpdate.role?.id,
      });

      enqueueSnackbar(formatMessage('editUser.successfullyUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-edit-user-success',
          persist: true,
        },
      });

      navigate(URLS.USERS);
    } catch (error) {
      throw new Error('Failed while updating!');
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle data-test="edit-user-title">
            {formatMessage('editUserPage.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          {isUserLoading && (
            <Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={45} />
            </Stack>
          )}

          {!isUserLoading && (
            <Form defaultValues={user} onSubmit={handleUserUpdate}>
              <Stack direction="column" gap={2}>
                <Stack direction="row" gap={2} mb={2} alignItems="center">
                  <Typography variant="h6" noWrap>
                    {formatMessage('editUser.status')}
                  </Typography>

                  <Chip
                    label={user.status}
                    variant="outlined"
                    color={user.status === 'active' ? 'success' : 'warning'}
                  />
                </Stack>

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
                  loading={isAdminUpdateUserPending}
                  data-test="update-button"
                >
                  {formatMessage('editUser.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
