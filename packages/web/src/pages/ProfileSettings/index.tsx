import { useMutation } from '@apollo/client';
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
import { UPDATE_CURRENT_USER } from 'graphql/mutations/update-current-user';
import useCurrentUser from 'hooks/useCurrentUser';
import useFormatMessage from 'hooks/useFormatMessage';

type TMutationInput = {
  fullName: string;
  email: string;
  password?: string;
};

const validationSchema = yup
  .object({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string(),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

const StyledForm = styled(Form)`
  display: flex;
  align-items: end;
  flex-direction: column;
`;

function ProfileSettings() {
  const [showDeleteAccountConfirmation, setShowDeleteAccountConfirmation] =
    React.useState(false);
  const enqueueSnackbar = useEnqueueSnackbar();
  const currentUser = useCurrentUser();
  const formatMessage = useFormatMessage();
  const [updateCurrentUser] = useMutation(UPDATE_CURRENT_USER);

  const handleProfileSettingsUpdate = async (data: any) => {
    const { fullName, password, email } = data;

    const mutationInput: TMutationInput = {
      fullName,
      email,
    };

    if (password) {
      mutationInput.password = password;
    }

    await updateCurrentUser({
      variables: {
        input: mutationInput,
      },
      optimisticResponse: {
        updateCurrentUser: {
          __typename: 'User',
          id: currentUser.id,
          fullName,
          email,
        },
      },
    });

    enqueueSnackbar(formatMessage('profileSettings.updatedProfile'), {
      variant: 'success',
      SnackbarProps: {
        'data-test': 'snackbar-update-profile-settings-success'
      }
    });
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
              password: '',
              confirmPassword: '',
            }}
            onSubmit={handleProfileSettingsUpdate}
            resolver={yupResolver(validationSchema)}
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
                />

                <TextField
                  fullWidth
                  name="email"
                  label={formatMessage('profileSettings.email')}
                  margin="dense"
                  error={touchedFields.email && !!errors?.email}
                  helperText={errors?.email?.message || ' '}
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
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                >
                  {formatMessage('profileSettings.updateProfile')}
                </Button>
              </>
            )}
          />
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Alert variant="outlined" severity="error" sx={{ fontWeight: 500 }}>
            <AlertTitle sx={{ fontWeight: 700 }}>
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
