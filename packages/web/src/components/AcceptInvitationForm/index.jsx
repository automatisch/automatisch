import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as yup from 'yup';
import Form from 'components/Form';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import useAcceptInvitation from 'hooks/useAcceptInvitation';
import useFormatMessage from 'hooks/useFormatMessage';

const validationSchema = yup.object().shape({
  password: yup.string().required('acceptInvitationForm.mandatoryInput'),
  confirmPassword: yup
    .string()
    .required('acceptInvitationForm.mandatoryInput')
    .oneOf([yup.ref('password')], 'acceptInvitationForm.passwordsMustMatch'),
});

export default function ResetPasswordForm() {
  const enqueueSnackbar = useEnqueueSnackbar();
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const acceptInvitation = useAcceptInvitation();
  const token = searchParams.get('token');

  const handleSubmit = async (values) => {
    await acceptInvitation.mutateAsync({
      password: values.password,
      token,
    });

    enqueueSnackbar(formatMessage('acceptInvitationForm.invitationAccepted'), {
      variant: 'success',
      SnackbarProps: {
        'data-test': 'snackbar-accept-invitation-success',
      },
    });

    navigate(URLS.LOGIN);
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
        data-test="accept-invitation-form-title"
      >
        {formatMessage('acceptInvitationForm.title')}
      </Typography>

      <Form
        onSubmit={handleSubmit}
        resolver={yupResolver(validationSchema)}
        mode="onChange"
        render={({ formState: { errors, touchedFields } }) => (
          <>
            <TextField
              label={formatMessage('acceptInvitationForm.passwordFieldLabel')}
              name="password"
              data-test="password-text-field"
              fullWidth
              margin="dense"
              type="password"
              error={touchedFields.password && !!errors?.password}
              helperText={
                touchedFields.password && errors?.password?.message
                  ? formatMessage(errors?.password?.message, {
                      inputName: formatMessage(
                        'acceptInvitationForm.passwordFieldLabel',
                      ),
                    })
                  : ''
              }
            />

            <TextField
              label={formatMessage(
                'acceptInvitationForm.confirmPasswordFieldLabel',
              )}
              name="confirmPassword"
              data-test="confirm-password-text-field"
              fullWidth
              margin="dense"
              type="password"
              error={touchedFields.confirmPassword && !!errors?.confirmPassword}
              helperText={
                touchedFields.confirmPassword &&
                errors?.confirmPassword?.message
                  ? formatMessage(errors?.confirmPassword?.message, {
                      inputName: formatMessage(
                        'acceptInvitationForm.confirmPasswordFieldLabel',
                      ),
                    })
                  : ''
              }
            />

            {acceptInvitation.isError && (
              <Alert
                data-test='accept-invitation-form-error'
                severity="error"
                sx={{ mt: 1, fontWeight: 500 }}
              >
                {formatMessage('acceptInvitationForm.invalidToken')}
              </Alert>
            )}

            <LoadingButton
              type="submit"
              variant="contained"
              data-test="submit-button"
              color="primary"
              sx={{ boxShadow: 2, my: 3 }}
              loading={acceptInvitation.isPending}
              disabled={!token}
              fullWidth
            >
              {formatMessage('acceptInvitationForm.submit')}
            </LoadingButton>
          </>
        )}
      />
    </Paper>
  );
}
