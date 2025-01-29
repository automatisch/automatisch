import * as React from 'react';
import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import CloseIcon from '@mui/icons-material/Close';

import { FieldPropType } from 'propTypes/propTypes';
import useFormatMessage from 'hooks/useFormatMessage';
import InputCreator from 'components/InputCreator';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import { Form } from './style';

function AdminApplicationOAuthClientUpdateDialog(props) {
  const {
    error,
    onClose,
    title,
    loading,
    authFields,
    defaultValues,
    disabled = false,
    submitAuthDefaults,
    submitBasicData,
    submittingBasicData,
    submittingAuthDefaults,
  } = props;
  const formatMessage = useFormatMessage();
  const { name, active, ...formattedAuthDefaults } = defaultValues;

  return (
    <Dialog open={true} onClose={onClose}>
      <IconButton
        aria-label="delete"
        sx={{ position: 'absolute', top: 10, right: 10 }}
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
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
            <Stack spacing={4}>
              <Form
                data-test="auth-client-form-update-basic-data"
                onSubmit={submitBasicData}
                defaultValues={{
                  active,
                  name,
                }}
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
                    <LoadingButton
                      data-test="submit-auth-client-form-update-basic-data"
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ boxShadow: 2 }}
                      loading={submittingBasicData}
                      disabled={disabled || !isDirty}
                    >
                      {formatMessage('oauthClient.buttonSubmit')}
                    </LoadingButton>
                  </>
                )}
              />
              {authFields?.length > 0 && (
                <>
                  <Divider />
                  <Form
                    data-test="auth-client-form-update-auth-defaults"
                    onSubmit={submitAuthDefaults}
                    defaultValues={formattedAuthDefaults}
                    render={({ formState: { isDirty } }) => (
                      <>
                        {authFields?.map((field) => (
                          <InputCreator key={field.key} schema={field} />
                        ))}
                        <LoadingButton
                          data-test="submit-auth-client-form-update-auth-defaults"
                          type="submit"
                          variant="contained"
                          color="primary"
                          sx={{ boxShadow: 2 }}
                          loading={submittingAuthDefaults}
                          disabled={disabled || !isDirty}
                        >
                          {formatMessage('oauthClient.buttonSubmit')}
                        </LoadingButton>
                      </>
                    )}
                  />
                </>
              )}
            </Stack>
          </DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  );
}

AdminApplicationOAuthClientUpdateDialog.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  submitAuthDefaults: PropTypes.func.isRequired,
  submitBasicData: PropTypes.func.isRequired,
  authFields: PropTypes.arrayOf(FieldPropType),
  submittingBasicData: PropTypes.bool.isRequired,
  submittingAuthDefaults: PropTypes.bool.isRequired,
  defaultValues: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
};

export default AdminApplicationOAuthClientUpdateDialog;
