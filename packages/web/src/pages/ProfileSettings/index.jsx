import { yupResolver } from '@hookform/resolvers/yup';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import * as yup from 'yup';

import Container from 'components/Container';
import DeleteAccountDialog from 'components/DeleteAccountDialog/index.ee';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useCurrentUser from 'hooks/useCurrentUser';
import useFormatMessage from 'hooks/useFormatMessage';
import useUpdateCurrentUser from 'hooks/useUpdateCurrentUser';
import useUpdateCurrentUserPassword from 'hooks/useUpdateCurrentUserPassword';

const validationSchemaProfile = yup
  .object({
    fullName: yup.string().required('Full name is required'),
    email: yup.string().email().required('Email is required'),
  })
  .required();

const validationSchemaPassword = yup
  .object({
    currentPassword: yup.string().required('Current password is required'),
    password: yup.string().required('New password is required'),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  })
  .required();

const StyledForm = styled(Form)`
  display: flex;
  align-items: end;
  flex-direction: column;
`;

const getErrorMessage = (error) => {
  const errors = error?.response?.data?.errors || {};
  const errorMessages = Object.entries(errors)
    .map(([key, messages]) => {
      if (Array.isArray(messages) && messages.length) {
        return `${key} ${messages.join(', ')}`;
      }
      if (typeof messages === 'string') {
        return `${key} ${messages}`;
      }
      return '';
    })
    .filter((message) => !!message)
    .join(' ');

  return errorMessages;
};

function ProfileSettings() {
  const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] =
    React.useState(false);
  const enqueueSnackbar = useEnqueueSnackbar();
  const { data } = useCurrentUser();
  const currentUser = data?.data;
  const formatMessage = useFormatMessage();
  const { mutateAsync: updateCurrentUser } = useUpdateCurrentUser(
    currentUser?.id,
  );
  const { mutateAsync: updateCurrentUserPassword } =
    useUpdateCurrentUserPassword(currentUser?.id);

  const handleProfileSettingsUpdate = async (data) => {
    try {
      const { fullName, email } = data;

      await updateCurrentUser({ fullName, email });

      enqueueSnackbar(formatMessage('profileSettings.updatedProfile'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-profile-settings-success',
        },
      });
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(error) ||
          formatMessage('profileSettings.updateProfileError'),
        {
          variant: 'error',
          SnackbarProps: {
            'data-test': 'snackbar-update-profile-settings-error',
          },
        },
      );
    }
  };

  const handlePasswordUpdate = async (data) => {
    try {
      const { password, currentPassword } = data;

      await updateCurrentUserPassword({
        currentPassword,
        password,
      });

      enqueueSnackbar(formatMessage('profileSettings.updatedPassword'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-password-success',
        },
      });
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(error) ||
          formatMessage('profileSettings.updatePasswordError'),
        {
          variant: 'error',
          SnackbarProps: {
            'data-test': 'snackbar-update-password-error',
          },
        },
      );
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('profileSettings.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end">
          <StyledForm
            defaultValues={{
              ...currentUser,
            }}
            onSubmit={handleProfileSettingsUpdate}
            resolver={yupResolver(validationSchemaProfile)}
            mode="onChange"
            sx={{ mb: 2 }}
            render={({
              formState: {
                errors,
                touchedFields,
                isDirty,
                isValid,
                isSubmitting,
              },
            }) => (
              <>
                <TextField
                  fullWidth
                  name="fullName"
                  label={formatMessage('profileSettings.fullName')}
                  margin="dense"
                  error={touchedFields.fullName && !!errors?.fullName}
                  helperText={errors?.fullName?.message || ' '}
                  required
                />
                <TextField
                  fullWidth
                  name="email"
                  label={formatMessage('profileSettings.email')}
                  margin="dense"
                  error={touchedFields.email && !!errors?.email}
                  helperText={errors?.email?.message || ' '}
                  required
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                  data-test="update-profile-button"
                >
                  {formatMessage('profileSettings.updateProfile')}
                </Button>
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 3 }}>
          <StyledForm
            defaultValues={{
              currentPassword: '',
              password: '',
              confirmPassword: '',
            }}
            onSubmit={handlePasswordUpdate}
            resolver={yupResolver(validationSchemaPassword)}
            mode="onChange"
            sx={{ mb: 2 }}
            render={({
              formState: {
                errors,
                touchedFields,
                isDirty,
                isValid,
                isSubmitting,
              },
            }) => (
              <>
                <TextField
                  fullWidth
                  name="currentPassword"
                  label={formatMessage('profileSettings.currentPassword')}
                  margin="dense"
                  type="password"
                  error={
                    touchedFields.currentPassword && !!errors?.currentPassword
                  }
                  helperText={
                    (touchedFields.currentPassword &&
                      errors?.currentPassword?.message) ||
                    ' '
                  }
                  required
                />

                <TextField
                  fullWidth
                  name="password"
                  label={formatMessage('profileSettings.newPassword')}
                  margin="dense"
                  type="password"
                  error={touchedFields.password && !!errors?.password}
                  helperText={
                    (touchedFields.password && errors?.password?.message) || ' '
                  }
                  required
                />
                <TextField
                  fullWidth
                  name="confirmPassword"
                  label={formatMessage('profileSettings.confirmNewPassword')}
                  margin="dense"
                  type="password"
                  error={
                    touchedFields.confirmPassword && !!errors?.confirmPassword
                  }
                  helperText={
                    (touchedFields.confirmPassword &&
                      errors?.confirmPassword?.message) ||
                    ' '
                  }
                  required
                />
                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                  data-test="update-password-button"
                >
                  {formatMessage('profileSettings.updatePassword')}
                </Button>
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Alert variant="outlined" severity="error">
            <AlertTitle>
              {formatMessage('profileSettings.deleteMyAccount')}
            </AlertTitle>

            <Typography variant="body1" gutterBottom>
              {formatMessage('profileSettings.deleteAccountSubtitle')}
            </Typography>

            <ol>
              <li>{formatMessage('profileSettings.deleteAccountResult1')}</li>
              <li>{formatMessage('profileSettings.deleteAccountResult2')}</li>
              <li>{formatMessage('profileSettings.deleteAccountResult3')}</li>
              <li>{formatMessage('profileSettings.deleteAccountResult4')}</li>
            </ol>

            <Button
              variant="contained"
              type="submit"
              color="error"
              size="small"
              sx={{ justifyContent: 'end' }}
              onClick={() => setShowDeleteAccountConfirmation(true)}
            >
              {formatMessage('profileSettings.deleteAccount')}
            </Button>

            {showDeleteAccountConfirmation && (
              <DeleteAccountDialog
                onClose={() => setShowDeleteAccountConfirmation(false)}
              />
            )}
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
}
export default ProfileSettings;
