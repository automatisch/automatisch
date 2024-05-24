import * as React from 'react';
import { useMutation } from '@apollo/client';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { FORGOT_PASSWORD } from 'graphql/mutations/forgot-password.ee';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

export default function ForgotPasswordForm() {
  const formatMessage = useFormatMessage();
  const [forgotPassword, { data, loading }] = useMutation(FORGOT_PASSWORD);

  const handleSubmit = async (values) => {
    await forgotPassword({
      variables: {
        input: values,
      },
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

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2, my: 3 }}
          loading={loading}
          disabled={data}
          fullWidth
        >
          {formatMessage('forgotPasswordForm.submit')}
        </LoadingButton>

        {data && (
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
