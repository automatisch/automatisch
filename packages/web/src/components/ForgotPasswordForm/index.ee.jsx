import * as React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import useForgotPassword from 'hooks/useForgotPassword';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

export default function ForgotPasswordForm() {
  const formatMessage = useFormatMessage();
  const {
    mutate: forgotPassword,
    isPending: loading,
    isSuccess,
    isError,
    error,
  } = useForgotPassword();

  const handleSubmit = ({ email }) => {
    forgotPassword({
      email,
    });
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
        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error?.message || formatMessage('forgotPasswordForm.error')}
          </Alert>
        )}
        {isSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {formatMessage('forgotPasswordForm.instructionsSent')}
          </Alert>
        )}
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
      </Form>
    </Paper>
  );
}
