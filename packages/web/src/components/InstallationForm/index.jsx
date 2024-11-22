import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import Link from '@mui/material/Link';

import { getGeneralErrorMessage } from 'helpers/errors';
import useFormatMessage from 'hooks/useFormatMessage';
import useInstallation from 'hooks/useInstallation';
import * as URLS from 'config/urls';
import Form from 'components/Form';
import TextField from 'components/TextField';

const getValidationSchema = (formatMessage) => {
  const getMandatoryInputMessage = (inputNameId) =>
    formatMessage('installationForm.mandatoryInput', {
      inputName: formatMessage(inputNameId),
    });

  return yup.object().shape({
    fullName: yup
      .string()
      .trim()
      .required(
        getMandatoryInputMessage('installationForm.fullNameFieldLabel'),
      ),
    email: yup
      .string()
      .trim()
      .required(getMandatoryInputMessage('installationForm.emailFieldLabel'))
      .email(formatMessage('installationForm.validateEmail')),
    password: yup
      .string()
      .required(getMandatoryInputMessage('installationForm.passwordFieldLabel'))
      .min(6, formatMessage('installationForm.passwordMinLength')),
    confirmPassword: yup
      .string()
      .required(
        getMandatoryInputMessage('installationForm.confirmPasswordFieldLabel'),
      )
      .oneOf(
        [yup.ref('password')],
        formatMessage('installationForm.passwordsMustMatch'),
      ),
  });
};

const defaultValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function InstallationForm() {
  const formatMessage = useFormatMessage();
  const { mutateAsync: install, isSuccess, isPending } = useInstallation();
  const queryClient = useQueryClient();

  const handleOnRedirect = () => {
    queryClient.invalidateQueries({
      queryKey: ['automatisch', 'info'],
    });
  };

  const handleSubmit = async ({ fullName, email, password }, e, setError) => {
    try {
      await install({
        fullName,
        email,
        password,
      });
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
        fallbackMessage: formatMessage('installationForm.error'),
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
        {formatMessage('installationForm.title')}
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
              label={formatMessage('installationForm.fullNameFieldLabel')}
              name="fullName"
              fullWidth
              margin="dense"
              autoComplete="fullName"
              data-test="fullName-text-field"
              error={!!errors?.fullName}
              helperText={errors?.fullName?.message}
              required
              readOnly={isSuccess}
            />

            <TextField
              label={formatMessage('installationForm.emailFieldLabel')}
              name="email"
              fullWidth
              margin="dense"
              autoComplete="email"
              data-test="email-text-field"
              error={!!errors?.email}
              helperText={errors?.email?.message}
              required
              readOnly={isSuccess}
            />

            <TextField
              label={formatMessage('installationForm.passwordFieldLabel')}
              name="password"
              fullWidth
              margin="dense"
              type="password"
              data-test="password-text-field"
              error={!!errors?.password}
              helperText={errors?.password?.message}
              required
              readOnly={isSuccess}
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
              error={!!errors?.confirmPassword}
              helperText={errors?.confirmPassword?.message}
              required
              readOnly={isSuccess}
            />

            {errors?.root?.general && (
              <Alert data-test="error-alert" severity="error" sx={{ mt: 2 }}>
                {errors.root.general.message}
              </Alert>
            )}

            {isSuccess && (
              <Alert
                data-test="success-alert"
                severity="success"
                sx={{ mt: 2 }}
              >
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
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, mt: 2 }}
              loading={isPending}
              disabled={isSuccess}
              fullWidth
              data-test="installation-button"
            >
              {formatMessage('installationForm.submit')}
            </LoadingButton>
          </>
        )}
      />
    </Paper>
  );
}

export default InstallationForm;
