import * as React from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import UploadIcon from '@mui/icons-material/Upload';

import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import FileUploadInput from 'components/FileUploadInput';
import useImportFlow from 'hooks/useImportFlow';
import { getUnifiedErrorMessage } from 'helpers/errors';

function ImportFlowDialog(props) {
  const { open = true, 'data-test': dataTest = 'import-flow-dialog' } = props;

  const [hasParsingError, setParsingError] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();

  const {
    mutate: importFlow,
    data: importedFlow,
    error,
    isError,
    isSuccess,
    reset,
  } = useImportFlow();

  const handleFileSelection = (event) => {
    reset();
    setParsingError(false);

    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const parseFlowFile = (fileContents) => {
    try {
      const flowData = JSON.parse(fileContents);

      return flowData;
    } catch {
      setParsingError(true);
    }
  };

  const handleImportFlow = (event) => {
    if (!selectedFile) return;

    const fileReader = new FileReader();

    fileReader.onload = async function readFileLoaded(e) {
      const flowData = parseFlowFile(e.target.result);

      if (flowData) {
        importFlow(flowData);
      }
    };

    fileReader.readAsText(selectedFile);
  };

  const onClose = () => {
    navigate('..');
  };

  return (
    <Dialog open={open} onClose={onClose} data-test={dataTest}>
      <DialogTitle>{formatMessage('importFlowDialog.title')}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {formatMessage('importFlowDialog.description')}

          <Stack direction="row" alignItems="center" spacing={2} mt={4}>
            <FileUploadInput
              onChange={handleFileSelection}
              data-test="import-flow-dialog-button"
            >
              {formatMessage('importFlowDialog.selectFile')}
            </FileUploadInput>

            {selectedFile && (
              <Typography>
                {formatMessage('importFlowDialog.selectedFileInformation', {
                  fileName: selectedFile.name,
                })}
              </Typography>
            )}
          </Stack>
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          data-test="import-flow-dialog-close-button"
        >
          {formatMessage('importFlowDialog.close')}
        </Button>

        <Button
          variant="contained"
          onClick={handleImportFlow}
          data-test="import-flow-dialog-import-button"
          startIcon={<UploadIcon />}
        >
          {formatMessage('importFlowDialog.import')}
        </Button>
      </DialogActions>

      {hasParsingError && (
        <Alert
          data-test="import-flow-dialog-parsing-error-alert"
          severity="error"
        >
          {formatMessage('importFlowDialog.parsingError')}
        </Alert>
      )}

      {isError && (
        <Alert
          data-test="import-flow-dialog-generic-error-alert"
          severity="error"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {getUnifiedErrorMessage(error?.response?.data?.errors) ||
            formatMessage('genericError')}
        </Alert>
      )}

      {isSuccess && (
        <Alert data-test="import-flow-dialog-success-alert" severity="success">
          {formatMessage('importFlowDialog.successfullyImportedFlow', {
            link: (str) => (
              <Link to={URLS.FLOW(importedFlow.data.id)}>{str}</Link>
            ),
          })}
        </Alert>
      )}
    </Dialog>
  );
}

ImportFlowDialog.propTypes = {
  open: PropTypes.bool,
  'data-test': PropTypes.string,
};

export default ImportFlowDialog;
