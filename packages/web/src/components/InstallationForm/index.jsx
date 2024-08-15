import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Alert } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { enqueueSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import Link from '@mui/material/Link';

import useFormatMessage from 'hooks/useFormatMessage';
import useInstallation from 'hooks/useInstallation';
import * as URLS from 'config/urls';
import Form from 'components/Form';
import TextField from 'components/TextField';

const validationSchema = yup.object().shape({
  fullName: yup.string().trim().required('installationForm.mandatoryInput'),
  email: yup
    .string()
    .trim()
    .email('installationForm.validateEmail')
    .required('installationForm.mandatoryInput'),
  password: yup.string().required('installationForm.mandatoryInput'),
  confirmPassword: yup
    .string()
    .required('installationForm.mandatoryInput')
    .oneOf([yup.ref('password')], 'installationForm.passwordsMustMatch'),
});

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function InstallationForm() {
  const formatMessage = useFormatMessage();
  const install = useInstallation();
  const queryClient = useQueryClient();

  const handleOnRedirect = () => {
    queryClient.invalidateQueries({
      queryKey: ['automatisch', 'info'],
    });
  };

  const handleSubmit = async (values) => {
    const { fullName, email, password } = values;
    try {
      await install.mutateAsync({
        fullName,
        email,
        password,
      });
    } catch (error) {
      enqueueSnackbar(
        error?.message || formatMessage('installationForm.error'),
        {
          variant: 'error',
        },
      );
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
        {formatMessage('installationForm.title')}
      </Typography>
      <Form
        defaultValues={initialValues}
        onSubmit={handleSubmit}
        resolver={yupResolver(validationSchema)}
        mode="onChange"
        render={({ formState: { errors, touchedFields } }) => (
          <>
            <TextField
              label={formatMessage('installationForm.fullNameFieldLabel')}
              name="fullName"
              fullWidth
              margin="dense"
              autoComplete="fullName"
              data-test="fullName-text-field"
              error={touchedFields.fullName && !!errors?.fullName}
              helperText={
                touchedFields.fullName && errors?.fullName?.message
                  ? formatMessage(errors?.fullName?.message, {
                      inputName: formatMessage(
                        'installationForm.fullNameFieldLabel',
                      ),
                    })
                  : ''
              }
              required
              readOnly={install.isSuccess}
            />
            <TextField
              label={formatMessage('installationForm.emailFieldLabel')}
              name="email"
              fullWidth
              margin="dense"
              autoComplete="email"
              data-test="email-text-field"
              error={touchedFields.email && !!errors?.email}
              helperText={
                touchedFields.email && errors?.email?.message
                  ? formatMessage(errors?.email?.message, {
                      inputName: formatMessage(
                        'installationForm.emailFieldLabel',
                      ),
                    })
                  : ''
              }
              required
              readOnly={install.isSuccess}
            />
            <TextField
              label={formatMessage('installationForm.passwordFieldLabel')}
              name="password"
              fullWidth
              margin="dense"
              type="password"
              data-test="password-text-field"
              error={touchedFields.password && !!errors?.password}
              helperText={
                touchedFields.password && errors?.password?.message
                  ? formatMessage(errors?.password?.message, {
                      inputName: formatMessage(
                        'installationForm.passwordFieldLabel',
                      ),
                    })
                  : ''
              }
              required
              readOnly={install.isSuccess}
            />
            <TextField
              label={formatMessage(
                'installationForm.confirmPasswordFieldLabel',
              )}
              name="confirmPassword"
              fullWidth
              margin="dense"
              type="password"
              data-test="repeat-password-text-field"
              error={touchedFields.confirmPassword && !!errors?.confirmPassword}
              helperText={
                touchedFields.confirmPassword &&
                errors?.confirmPassword?.message
                  ? formatMessage(errors?.confirmPassword?.message, {
                      inputName: formatMessage(
                        'installationForm.confirmPasswordFieldLabel',
                      ),
                    })
                  : ''
              }
              required
              readOnly={install.isSuccess}
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, mt: 3 }}
              loading={install.isPending}
              disabled={install.isSuccess}
              fullWidth
              data-test="signUp-button"
            >
              {formatMessage('installationForm.submit')}
            </LoadingButton>
          </>
        )}
      />
      {install.isSuccess && (
        <Alert data-test="success-alert" severity="success" sx={{ mt: 3, fontWeight: 500 }}>
          {formatMessage('installationForm.success', {
            link: (str) => (
              <Link
                component={RouterLink}
                to={URLS.LOGIN}
                onClick={handleOnRedirect}
                replace
              >
                {str}
              </Link>
            ),
          })}
        </Alert>
      )}
    </Paper>
  );
}

export default InstallationForm;
