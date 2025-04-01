import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import MuiTextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

function generateRoleOptions(roles) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

const getValidationSchema = (formatMessage, canUpdateRole) => {
  const getMandatoryFieldMessage = (fieldTranslationId) =>
    formatMessage('userForm.mandatoryInput', {
      inputName: formatMessage(fieldTranslationId),
    });

  return yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('userForm.fullName')),
    email: yup
      .string()
      .trim()
      .email(formatMessage('userForm.validateEmail'))
      .required(getMandatoryFieldMessage('userForm.email')),
    ...(canUpdateRole
      ? {
          roleId: yup
            .string()
            .required(getMandatoryFieldMessage('userForm.role')),
        }
      : {}),
  });
};

const defaultValues = {
  fullName: '',
  email: '',
  roleId: '',
};

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
  const currentUserAbility = useCurrentUserAbility();
  const canUpdateRole = currentUserAbility.can('manage', 'Role');

  const handleUserUpdate = async (userDataToUpdate) => {
    try {
      await updateUser({
        fullName: userDataToUpdate.fullName,
        email: userDataToUpdate.email,
        roleId: userDataToUpdate.roleId,
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
      const errors = error?.response?.data?.errors;

      throw errors || error;
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
            <Form
              defaultValues={
                user
                  ? {
                      fullName: user.fullName,
                      email: user.email,
                      roleId: user.role.id,
                    }
                  : defaultValues
              }
              onSubmit={handleUserUpdate}
              resolver={yupResolver(
                getValidationSchema(formatMessage, canUpdateRole),
              )}
              noValidate
              render={({ formState: { errors } }) => (
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
                    error={!!errors?.fullName}
                    helperText={errors?.fullName?.message}
                  />

                  <TextField
                    required={true}
                    name="email"
                    label={formatMessage('userForm.email')}
                    data-test="email-input"
                    fullWidth
                    error={!!errors?.email}
                    helperText={errors?.email?.message}
                  />

                  <Can I="update" a="Role">
                    <ControlledAutocomplete
                      name="roleId"
                      fullWidth
                      disablePortal
                      disableClearable={true}
                      options={generateRoleOptions(roles)}
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label={formatMessage('userForm.role')}
                          error={!!errors?.roleId}
                          helperText={errors?.roleId?.message}
                        />
                      )}
                      loading={isRolesLoading}
                      showHelperText={false}
                    />
                  </Can>

                  {errors?.root?.general && (
                    <Alert data-test="update-user-error-alert" severity="error">
                      {errors?.root?.general?.message}
                    </Alert>
                  )}

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
              )}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
