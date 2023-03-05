import * as React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import * as URLS from 'config/urls';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import { RESET_PASSWORD } from 'graphql/mutations/reset-password.ee';

const validationSchema = yup.object().shape({
  password: yup.string().required('resetPasswordForm.mandatoryInput'),
  confirmPassword: yup
    .string()
    .required('resetPasswordForm.mandatoryInput')
    .oneOf([yup.ref('password')], 'resetPasswordForm.passwordsMustMatch'),
});

export default function ResetPasswordForm() {
  const { enqueueSnackbar } = useSnackbar();
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [resetPassword, { data, loading }] = useMutation(RESET_PASSWORD);

  const token = searchParams.get('token');

  const handleSubmit = async (values: any) => {
    await resetPassword({
      variables: {
        input: {
          password: values.password,
          token,
        },
      },
    });

    enqueueSnackbar(formatMessage('resetPasswordForm.passwordUpdated'), { variant: 'success' });

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
      >
        {formatMessage('resetPasswordForm.title')}
      </Typography>

      <Form
        onSubmit={handleSubmit}
        resolver={yupResolver(validationSchema)}
        mode="onChange"
        render={({ formState: { errors, touchedFields } }) => (
          <>
            <TextField
              label={formatMessage('resetPasswordForm.passwordFieldLabel')}
              name="password"
              fullWidth
              margin="dense"
              type="password"
              error={touchedFields.password && !!errors?.password}
              helperText={
                touchedFields.password && errors?.password?.message
                  ? formatMessage(errors?.password?.message, {
                      inputName: formatMessage('resetPasswordForm.passwordFieldLabel'),
                    })
                  : ''
              }
            />

            <TextField
              label={formatMessage('resetPasswordForm.confirmPasswordFieldLabel')}
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
                        'resetPasswordForm.confirmPasswordFieldLabel'
                      ),
                    })
                  : ''
              }
            />

            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, my: 3 }}
              loading={loading}
              disabled={data || !token}
              fullWidth
            >
              {formatMessage('resetPasswordForm.submit')}
            </LoadingButton>
          </>
        )}
      />
    </Paper>
  );
}
