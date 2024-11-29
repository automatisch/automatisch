import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import MuiTextField from '@mui/material/TextField';
import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Can from 'components/Can';
import Container from 'components/Container';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles.ee';
import useAdminCreateUser from 'hooks/useAdminCreateUser';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import {
  fieldHasError,
  getFieldErrorMessage,
  getGeneralErrorMessage,
} from 'helpers/errors';

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
          role: yup.object().shape({
            id: yup
              .string()
              .required(getMandatoryFieldMessage('userForm.role')),
          }),
        }
      : {}),
  });
};

const defaultValues = {
  fullName: '',
  email: '',
  role: {
    id: '',
  },
};

export default function CreateUser() {
  const formatMessage = useFormatMessage();
  const {
    mutateAsync: createUser,
    isPending: isCreateUserPending,
    data: createdUser,
    error: createUserError,
    isSuccess: createUserSuccess,
  } = useAdminCreateUser();
  const { data: rolesData, loading: isRolesLoading } = useRoles();
  const roles = rolesData?.data;
  const queryClient = useQueryClient();
  const currentUserAbility = useCurrentUserAbility();
  const canUpdateRole = currentUserAbility.can('update', 'Role');
  const generalErrorMessage = getGeneralErrorMessage({
    error: createUserError,
    fallbackMessage: formatMessage('createUser.error'),
  });

  const handleUserCreation = async (userData) => {
    try {
      await createUser({
        fullName: userData.fullName,
        email: userData.email,
        roleId: userData.role?.id,
      });

      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    } catch {}
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
          <Form
            noValidate
            onSubmit={handleUserCreation}
            mode="onSubmit"
            defaultValues={defaultValues}
            resolver={yupResolver(
              getValidationSchema(formatMessage, canUpdateRole),
            )}
            automaticValidation={false}
            render={({ formState: { errors } }) => (
              <Stack direction="column" gap={2}>
                <TextField
                  required={true}
                  name="fullName"
                  label={formatMessage('userForm.fullName')}
                  data-test="full-name-input"
                  fullWidth
                  error={
                    fieldHasError({
                      error: createUserError,
                      fieldName: 'fullName',
                    }) || !!errors?.fullName
                  }
                  helperText={
                    getFieldErrorMessage({
                      fieldName: 'fullName',
                      error: createUserError,
                    }) ||
                    errors?.fullName?.message ||
                    ''
                  }
                />

                <TextField
                  required={true}
                  name="email"
                  label={formatMessage('userForm.email')}
                  data-test="email-input"
                  fullWidth
                  error={
                    fieldHasError({
                      error: createUserError,
                      fieldName: 'email',
                    }) || !!errors?.email
                  }
                  helperText={
                    getFieldErrorMessage({
                      fieldName: 'email',
                      error: createUserError,
                    }) ||
                    errors?.email?.message ||
                    ''
                  }
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
                        error={
                          fieldHasError({
                            error: createUserError,
                            fieldName: 'roleId',
                          }) || !!errors?.role?.id
                        }
                        helperText={
                          getFieldErrorMessage({
                            fieldName: 'roleId',
                            error: createUserError,
                          }) ||
                          errors?.role?.id?.message ||
                          ''
                        }
                      />
                    )}
                    loading={isRolesLoading}
                    showHelperText={false}
                  />
                </Can>

                {generalErrorMessage && (
                  <Alert data-test="create-user-error-alert" severity="error">
                    {generalErrorMessage}
                  </Alert>
                )}

                {createUserSuccess && (
                  <Alert
                    severity="success"
                    data-test="create-user-success-alert"
                  >
                    {formatMessage('createUser.successfullyCreated')}
                  </Alert>
                )}

                {createdUser && (
                  <Alert
                    severity="info"
                    color="primary"
                    data-test="invitation-email-info-alert"
                    sx={{
                      a: {
                        wordBreak: 'break-all',
                      },
                    }}
                  >
                    {formatMessage('createUser.invitationEmailInfo', {
                      link: () => (
                        <a
                          href={createdUser.data.acceptInvitationUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {createdUser.data.acceptInvitationUrl}
                        </a>
                      ),
                    })}
                  </Alert>
                )}

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={isCreateUserPending}
                  data-test="create-button"
                >
                  {formatMessage('createUser.submit')}
                </LoadingButton>
              </Stack>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
