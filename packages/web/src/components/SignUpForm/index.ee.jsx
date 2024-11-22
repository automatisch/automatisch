import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { getGeneralErrorMessage } from 'helpers/errors';
import useAuthentication from 'hooks/useAuthentication';
import * as URLS from 'config/urls';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateAccessToken from 'hooks/useCreateAccessToken';
import useRegisterUser from 'hooks/useRegisterUser';

const getValidationSchema = (formatMessage) => {
  const getMandatoryInputMessage = (inputNameId) =>
    formatMessage('signupForm.mandatoryInput', {
      inputName: formatMessage(inputNameId),
    });

  return yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required(getMandatoryInputMessage('signupForm.fullNameFieldLabel')),
    email: yup
      .string()
      .trim()
      .required(getMandatoryInputMessage('signupForm.emailFieldLabel'))
      .email(formatMessage('signupForm.validateEmail')),
    password: yup
      .string()
      .required(getMandatoryInputMessage('signupForm.passwordFieldLabel'))
      .min(6, formatMessage('signupForm.passwordMinLength')),
    confirmPassword: yup
      .string()
      .required(
        getMandatoryInputMessage('signupForm.confirmPasswordFieldLabel'),
      )
      .oneOf(
        [yup.ref('password')],
        formatMessage('signupForm.passwordsMustMatch'),
      ),
  });
};

const defaultValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function SignUpForm() {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const formatMessage = useFormatMessage();
  const { mutateAsync: registerUser, isPending: isRegisterUserPending } =
    useRegisterUser();
  const { mutateAsync: createAccessToken, isPending: loginLoading } =
    useCreateAccessToken();

  React.useEffect(() => {
    if (authentication.isAuthenticated) {
      navigate(URLS.DASHBOARD);
    }
  }, [authentication.isAuthenticated]);

  const handleSubmit = async (values, e, setError) => {
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
      const errors = error?.response?.data?.errors;
      if (errors) {
        const fieldNames = Object.keys(defaultValues);
        Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
          if (fieldNames.includes(fieldName) && Array.isArray(fieldErrors)) {
            setError(fieldName, {
              type: 'fieldRequestError',
              message: fieldErrors.join(', '),
            });
          }
        });
      }

      const generalError = getGeneralErrorMessage({
        error,
        fallbackMessage: formatMessage('signupForm.error'),
      });

      if (generalError) {
        setError('root.general', {
          type: 'requestError',
          message: generalError,
        });
      }
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
        automaticValidation={false}
        noValidate
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        resolver={yupResolver(getValidationSchema(formatMessage))}
        mode="onChange"
        render={({ formState: { errors } }) => (
          <>
            <TextField
              label={formatMessage('signupForm.fullNameFieldLabel')}
              name="fullName"
              fullWidth
              margin="dense"
              autoComplete="fullName"
              data-test="fullName-text-field"
              error={!!errors?.fullName}
              helperText={errors?.fullName?.message}
              required
            />

            <TextField
              label={formatMessage('signupForm.emailFieldLabel')}
              name="email"
              fullWidth
              margin="dense"
              autoComplete="email"
              data-test="email-text-field"
              error={!!errors?.email}
              helperText={errors?.email?.message}
              required
            />

            <TextField
              label={formatMessage('signupForm.passwordFieldLabel')}
              name="password"
              fullWidth
              margin="dense"
              type="password"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              required
            />

            <TextField
              label={formatMessage('signupForm.confirmPasswordFieldLabel')}
              name="confirmPassword"
              fullWidth
              margin="dense"
              type="password"
              error={!!errors?.confirmPassword}
              helperText={errors?.confirmPassword?.message}
              required
            />

            {errors?.root?.general && (
              <Alert
                data-test="alert-sign-up-error"
                severity="error"
                sx={{ mt: 2 }}
              >
                {errors.root.general.message}
              </Alert>
            )}

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
