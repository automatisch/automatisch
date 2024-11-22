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

import {
  fieldHasError,
  getFieldErrorMessage,
  getGeneralErrorMessage,
} from 'helpers/errors';
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
  password: yup
    .string()
    .min(6, 'installationForm.passwordMinLength')
    .required('installationForm.mandatoryInput'),
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
  const {
    mutate: install,
    isSuccess,
    isPending,
    error: installationError,
  } = useInstallation();
  const queryClient = useQueryClient();

  const handleOnRedirect = () => {
    queryClient.invalidateQueries({
      queryKey: ['automatisch', 'info'],
    });
  };

  const handleSubmit = ({ fullName, email, password }) => {
    install({
      fullName,
      email,
      password,
    });
  };

  const getInputErrorMessage = ({
    fieldName,
    fieldTranslationId,
    formErrors,
    touchedFields,
  }) => {
    const installationErrorMessage = getFieldErrorMessage({
      fieldName,
      error: installationError,
    });

    const formErrorMessage = formErrors?.[fieldName]?.message;

    if (installationErrorMessage) {
      return installationErrorMessage;
    } else if (touchedFields?.[fieldName] && formErrorMessage) {
      return formatMessage(formErrorMessage, {
        inputName: formatMessage(fieldTranslationId),
      });
    }

    return '';
  };

  const renderGeneralErrorAlert = () => {
    const errorMessage = getGeneralErrorMessage({
      error: installationError,
      fallbackMessage: formatMessage('installationForm.error'),
    });

    if (errorMessage) {
      return (
        <Alert data-test="error-alert" severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
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
        noValidate
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
              error={
                fieldHasError({
                  error: installationError,
                  fieldName: 'fullName',
                }) ||
                (touchedFields.fullName && !!errors?.fullName)
              }
              helperText={getInputErrorMessage({
                fieldName: 'fullName',
                fieldTranslationId: 'installationForm.fullNameFieldLabel',
                formErrors: errors,
                touchedFields,
              })}
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
              error={
                fieldHasError({
                  error: installationError,
                  fieldName: 'email',
                }) ||
                (touchedFields.email && !!errors?.email)
              }
              helperText={getInputErrorMessage({
                fieldName: 'email',
                fieldTranslationId: 'installationForm.emailFieldLabel',
                formErrors: errors,
                touchedFields,
              })}
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
              error={
                fieldHasError({
                  error: installationError,
                  fieldName: 'password',
                }) ||
                (touchedFields.password && !!errors?.password)
              }
              helperText={getInputErrorMessage({
                fieldName: 'password',
                fieldTranslationId: 'installationForm.passwordFieldLabel',
                formErrors: errors,
                touchedFields,
              })}
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
              error={touchedFields.confirmPassword && !!errors?.confirmPassword}
              helperText={getInputErrorMessage({
                fieldName: 'confirmPassword',
                fieldTranslationId:
                  'installationForm.confirmPasswordFieldLabel',
                formErrors: errors,
                touchedFields,
              })}
              required
              readOnly={isSuccess}
            />
            {renderGeneralErrorAlert()}
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
              data-test="signUp-button"
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
