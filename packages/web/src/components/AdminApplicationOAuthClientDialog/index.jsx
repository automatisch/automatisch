import * as React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import { FieldPropType } from 'propTypes/propTypes';
import useFormatMessage from 'hooks/useFormatMessage';
import InputCreator from 'components/InputCreator';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import { Form } from './style';

function AdminApplicationOAuthClientDialog(props) {
  const {
    error,
    onClose,
    title,
    loading,
    submitHandler,
    authFields,
    submitting,
    defaultValues,
    disabled = false,
  } = props;
  const formatMessage = useFormatMessage();
  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      {error && (
        <Alert severity="error" sx={{ mt: 1, wordBreak: 'break-all' }}>
          {error.message}
        </Alert>
      )}
      <DialogContent>
        {loading ? (
          <CircularProgress
            data-test="search-for-app-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        ) : (
          <DialogContentText tabIndex={-1} component="div">
            <Form
              data-test="auth-client-form"
              onSubmit={submitHandler}
              defaultValues={defaultValues}
              render={({ formState: { isDirty } }) => (
                <>
                  <Switch
                    name="active"
                    label={formatMessage('oauthClient.inputActive')}
                  />
                  <TextField
                    required={true}
                    name="name"
                    label={formatMessage('oauthClient.inputName')}
                    fullWidth
                  />
                  {authFields?.map((field) => (
                    <InputCreator key={field.key} schema={field} />
                  ))}
                  <LoadingButton
                    data-test="submit-auth-client-form"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ boxShadow: 2 }}
                    loading={submitting}
                    disabled={disabled || !isDirty}
                  >
                    {formatMessage('oauthClient.buttonSubmit')}
                  </LoadingButton>
                </>
              )}
            ></Form>
          </DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  );
}

AdminApplicationOAuthClientDialog.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  submitHandler: PropTypes.func.isRequired,
  authFields: PropTypes.arrayOf(FieldPropType),
  submitting: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

export default AdminApplicationOAuthClientDialog;
