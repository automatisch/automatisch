import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import useAuthentication from 'hooks/useAuthentication';
import * as URLS from 'config/urls';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateAccessToken from 'hooks/useCreateAccessToken';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useRegisterUser from 'hooks/useRegisterUser';

const validationSchema = yup.object().shape({
  fullName: yup.string().trim().required('signupForm.mandatoryInput'),
  email: yup
    .string()
    .trim()
    .email('signupForm.validateEmail')
    .required('signupForm.mandatoryInput'),
  password: yup.string().required('signupForm.mandatoryInput'),
  confirmPassword: yup
    .string()
    .required('signupForm.mandatoryInput')
    .oneOf([yup.ref('password')], 'signupForm.passwordsMustMatch'),
});

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function SignUpForm() {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: registerUser, isPending: isRegisterUserPending } =
    useRegisterUser();
  const { mutateAsync: createAccessToken, isPending: loginLoading } =
    useCreateAccessToken();

  React.useEffect(() => {
    if (authentication.isAuthenticated) {
      navigate(URLS.DASHBOARD);
    }
  }, [authentication.isAuthenticated]);

  const handleSubmit = async (values) => {
    try {
      const { fullName, email, password } = values;
      await registerUser({
        fullName,
        email,
        password,
      });

      const { data } = await createAccessToken({
        email,
        password,
      });
      const { token } = data;
      authentication.updateToken(token);
    } catch (error) {
      enqueueSnackbar(error?.message || formatMessage('signupForm.error'), {
        variant: 'error',
      });
    }
  };

  return (
    <Paper sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.text.disabled,
          pb: 2,
          mb: 2,
        }}
        gutterBottom
      >
        {formatMessage('signupForm.title')}
      </Typography>

      <Form
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        resolver={yupResolver(validationSchema)}
        mode="onChange"
        render={({ formState: { errors, touchedFields } }) => (
          <>
            <TextField
              label={formatMessage('signupForm.fullNameFieldLabel')}
              name="fullName"
              fullWidth
              margin="dense"
              autoComplete="fullName"
              data-test="fullName-text-field"
              error={touchedFields.fullName && !!errors?.fullName}
              helperText={
                touchedFields.fullName && errors?.fullName?.message
                  ? formatMessage(errors?.fullName?.message, {
                      inputName: formatMessage('signupForm.fullNameFieldLabel'),
                    })
                  : ''
              }
            />

            <TextField
              label={formatMessage('signupForm.emailFieldLabel')}
              name="email"
              fullWidth
              margin="dense"
              autoComplete="email"
              data-test="email-text-field"
              error={touchedFields.email && !!errors?.email}
              helperText={
                touchedFields.email && errors?.email?.message
                  ? formatMessage(errors?.email?.message, {
                      inputName: formatMessage('signupForm.emailFieldLabel'),
                    })
                  : ''
              }
            />

            <TextField
              label={formatMessage('signupForm.passwordFieldLabel')}
              name="password"
              fullWidth
              margin="dense"
              type="password"
              error={touchedFields.password && !!errors?.password}
              helperText={
                touchedFields.password && errors?.password?.message
                  ? formatMessage(errors?.password?.message, {
                      inputName: formatMessage('signupForm.passwordFieldLabel'),
                    })
                  : ''
              }
            />

            <TextField
              label={formatMessage('signupForm.confirmPasswordFieldLabel')}
              name="confirmPassword"
              fullWidth
              margin="dense"
              type="password"
              error={touchedFields.confirmPassword && !!errors?.confirmPassword}
              helperText={
                touchedFields.confirmPassword &&
                errors?.confirmPassword?.message
                  ? formatMessage(errors?.confirmPassword?.message, {
                      inputName: formatMessage(
                        'signupForm.confirmPasswordFieldLabel',
                      ),
                    })
                  : ''
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, mt: 3 }}
              loading={isRegisterUserPending || loginLoading}
              fullWidth
              data-test="signUp-button"
            >
              {formatMessage('signupForm.submit')}
            </LoadingButton>
          </>
        )}
      />
    </Paper>
  );
}

export default SignUpForm;
