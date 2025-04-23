import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MuiTextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import * as React from 'react';

import copyValue from 'helpers/copyValue';
import { makeBold } from 'helpers/translationValues';
import useFormatMessage from 'hooks/useFormatMessage';

function CreatedApiTokenDialog(props) {
  const {
    open = true,
    'data-test': dataTest = 'created-api-token-dialog',
    onClose,
    apiToken,
  } = props;

  const formatMessage = useFormatMessage();

  return (
    <Dialog open={open} onClose={onClose} data-test={dataTest}>
      <DialogTitle>{formatMessage('createdApiTokenDialog.title')}</DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: 4 }}>
          {formatMessage('createdApiTokenDialog.description')}
        </DialogContentText>

        <MuiTextField
          label={formatMessage('createdApiTokenDialog.apiTokenFieldLabel')}
          variant="outlined"
          value={apiToken}
          fullWidth
          InputLabelProps={{ shrink: true }}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => copyValue(apiToken)} edge="end">
                  <ContentCopyIcon color="primary" />
                </IconButton>
              </InputAdornment>
            ),
          }}
          inputProps={{
            'data-test': 'api-token-field',
          }}
        />

        <Alert severity="error" sx={{ mt: 1 }}>
          {formatMessage('createdApiTokenDialog.warningForApiToken', {
            strong: makeBold,
          })}
        </Alert>
      </DialogContent>

      <DialogActions sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          data-test="import-flow-dialog-close-button"
        >
          {formatMessage('createdApiTokenDialog.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreatedApiTokenDialog.propTypes = {
  open: PropTypes.bool,
  'data-test': PropTypes.string,
  apiToken: PropTypes.string,
  onClose: PropTypes.func,
};

export default CreatedApiTokenDialog;
