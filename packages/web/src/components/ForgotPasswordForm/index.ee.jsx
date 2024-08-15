import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { enqueueSnackbar } from 'notistack';

import useForgotPassword from 'hooks/useForgotPassword';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

export default function ForgotPasswordForm() {
  const formatMessage = useFormatMessage();
  const {
    mutateAsync: forgotPassword,
    isPending: loading,
    isSuccess,
  } = useForgotPassword();

  const handleSubmit = async (values) => {
    const { email } = values;
    try {
      await forgotPassword({
        email,
      });
    } catch (error) {
      enqueueSnackbar(
        error?.message || formatMessage('forgotPasswordForm.error'),
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
        {formatMessage('forgotPasswordForm.title')}
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          label={formatMessage('forgotPasswordForm.emailFieldLabel')}
          name="email"
          required
          fullWidth
          margin="dense"
          autoComplete="username"
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2, my: 3 }}
          loading={loading}
          disabled={isSuccess}
          fullWidth
        >
          {formatMessage('forgotPasswordForm.submit')}
        </LoadingButton>
        {isSuccess && (
          <Typography
            variant="body1"
            sx={{ color: (theme) => theme.palette.success.main }}
          >
            {formatMessage('forgotPasswordForm.instructionsSent')}
          </Typography>
        )}
      </Form>
    </Paper>
  );
}
