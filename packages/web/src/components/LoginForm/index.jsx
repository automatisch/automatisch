import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import useAuthentication from 'hooks/useAuthentication';
import useCloud from 'hooks/useCloud';
import * as URLS from 'config/urls';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useCreateAccessToken from 'hooks/useCreateAccessToken';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';

function LoginForm() {
  const isCloud = useCloud();
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const authentication = useAuthentication();
  const { mutateAsync: createAccessToken, isPending: loading } =
    useCreateAccessToken();

  React.useEffect(() => {
    if (authentication.isAuthenticated) {
      navigate(URLS.DASHBOARD);
    }
  }, [authentication.isAuthenticated]);

  const handleSubmit = async (values) => {
    try {
      const { email, password } = values;
      const { data } = await createAccessToken({
        email,
        password,
      });
      const { token } = data;
      authentication.updateToken(token);
    } catch (error) {
      enqueueSnackbar(error?.message || formatMessage('loginForm.error'), {
        variant: 'error',
      });
    }
  };

  return (
    <Paper sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        data-test="login-form-title"
        sx={{
          borderBottom: '1px solid',
          borderColor: (theme) => theme.palette.text.disabled,
          pb: 2,
          mb: 2,
        }}
        gutterBottom
      >
        {formatMessage('loginForm.title')}
      </Typography>

      <Form onSubmit={handleSubmit}>
        <TextField
          label={formatMessage('loginForm.emailFieldLabel')}
          name="email"
          required
          fullWidth
          margin="dense"
          autoComplete="username"
          data-test="email-text-field"
        />

        <TextField
          label={formatMessage('loginForm.passwordFieldLabel')}
          name="password"
          type="password"
          required
          fullWidth
          margin="dense"
          autoComplete="current-password"
          data-test="password-text-field"
          sx={{ mb: 1 }}
        />

        {isCloud && (
          <Link
            component={RouterLink}
            to={URLS.FORGOT_PASSWORD}
            underline="none"
          >
            {formatMessage('loginForm.forgotPasswordText')}
          </Link>
        )}

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2, mt: 3 }}
          loading={loading}
          fullWidth
          data-test="login-button"
        >
          {formatMessage('loginForm.submit')}
        </LoadingButton>

        {isCloud && (
          <Typography variant="body1" align="center" mt={3}>
            {formatMessage('loginForm.noAccount')}
            &nbsp;
            <Link component={RouterLink} to={URLS.SIGNUP} underline="none">
              {formatMessage('loginForm.signUp')}
            </Link>
          </Typography>
        )}
      </Form>
    </Paper>
  );
}

export default LoginForm;
