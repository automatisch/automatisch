import * as React from 'react';
import { useMutation } from '@apollo/client';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import Form from 'components/Form';
import TextField from 'components/TextField';
import { UPDATE_USER } from 'graphql/mutations/update-user';
import useFormatMessage from 'hooks/useFormatMessage';
import useCurrentUser from 'hooks/useCurrentUser';

const emailValidationSchema = yup.object({
  email: yup.string().email().required(),
}).required();

const passwordValidationSchema = yup.object({
  password: yup.string().required(),
  confirmPassword: yup.string().required().oneOf([yup.ref('password')], 'Passwords must match'),
}).required();

const StyledForm = styled(Form)`
  display: flex;
  align-items: end;
  flex-direction: column;
`;

function ProfileSettings() {
  const [passwordDefaultValues, setPasswordDefaultValues] = React.useState({});
  const { enqueueSnackbar } = useSnackbar();
  const currentUser = useCurrentUser();
  const formatMessage = useFormatMessage();
  const [updateUser] = useMutation(UPDATE_USER);

  const handleEmailUpdate = async (data: any) => {
    const email = data.email;

    await updateUser({
      variables: {
        input: {
          email,
        }
      },
      optimisticResponse: {
        updateUser: {
          __typename: 'User',
          email,
        }
      }
    });

    enqueueSnackbar(formatMessage('profileSettings.updatedEmail'), { variant: 'success' });
  }

  const handlePasswordUpdate = async (data: any) => {
    const password = data.password;

    setPasswordDefaultValues({
      password,
      confirmPassword: data.confirmPassword,
    })

    await updateUser({
      variables: {
        input: {
          password,
        }
      },
    });

    enqueueSnackbar(formatMessage('profileSettings.updatedPassword'), { variant: 'success' });
  }

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={8} lg={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }} >
          <PageTitle>
            {formatMessage('profileSettings.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end">
          <StyledForm
            defaultValues={currentUser}
            onSubmit={handleEmailUpdate}
            resolver={yupResolver(emailValidationSchema)}
            mode="onChange"
            sx={{ mb: 2 }}
            render={({ formState: { errors, isDirty, isValid, isSubmitting } }) => (
              <>
               <TextField
                  fullWidth
                  name="email"
                  label={formatMessage('profileSettings.email')}
                  margin="normal"
                  error={!!errors?.email}
                  helperText={errors?.email?.message || ' '}
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                >
                  {formatMessage('profileSettings.updateEmail')}
                </Button>
              </>
            )}
          />

          <StyledForm
            defaultValues={passwordDefaultValues}
            onSubmit={handlePasswordUpdate}
            resolver={yupResolver(passwordValidationSchema)}
            mode="onChange"
            render={({ formState: { errors, isDirty, isValid, isSubmitting } }) => (
              <>
                <TextField
                  fullWidth
                  name="password"
                  label={formatMessage('profileSettings.newPassword')}
                  margin="normal"
                  type="password"
                  error={!!errors?.password}
                  helperText={errors?.password?.message || ' '}
                />

                <TextField
                  fullWidth
                  name="confirmPassword"
                  label={formatMessage('profileSettings.confirmNewPassword')}
                  margin="normal"
                  type="password"
                  error={!!errors?.confirmPassword}
                  helperText={errors?.confirmPassword?.message || ' '}
                />

                <Button
                  variant="contained"
                  type="submit"
                  disabled={!isDirty || !isValid || isSubmitting}
                >
                  {formatMessage('profileSettings.updatePassword')}
                </Button>
              </>
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfileSettings;
