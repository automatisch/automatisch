import UploadIcon from '@mui/icons-material/Upload';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import FileUploadInput from 'components/FileUploadInput';
import * as URLS from 'config/urls';
import { getUnifiedErrorMessage } from 'helpers/errors';
import useFormatMessage from 'hooks/useFormatMessage';
import useImportFlow from 'hooks/useImportFlow';

function ImportFlowDialog(props) {
  const { open = true, 'data-test': dataTest = 'import-flow-dialog' } = props;

  const [hasParsingError, setParsingError] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const location = useLocation();
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

  const handleImportFlow = () => {
    if (!selectedFile) return;

    const fileReader = new window.FileReader();

    fileReader.onload = async function readFileLoaded(e) {
      const flowData = parseFlowFile(e.target.result);

      if (flowData) {
        importFlow(flowData);
      }
    };

    fileReader.readAsText(selectedFile);
  };

  const onClose = () => {
    navigate({ pathname: URLS.FLOWS, search: location.search });
  };

  return (
    <Dialog open={open} onClose={onClose} data-test={dataTest}>
      <DialogTitle>{formatMessage('importFlowDialog.title')}</DialogTitle>

      <DialogContent>
        <DialogContentText>
          {formatMessage('importFlowDialog.description')}
        </DialogContentText>
        <Stack direction="row" alignItems="center" spacing={2} mt={4}>
          <FileUploadInput
            onChange={handleFileSelection}
            data-test="import-flow-dialog-button"
            sx={{ flexShrink: 0 }}
          >
            {formatMessage('importFlowDialog.selectFile')}
          </FileUploadInput>

          {selectedFile && (
            <Box data-test="file-name-wrapper" overflow="hidden">
              <Typography>
                {formatMessage('importFlowDialog.selectedFileInformation')}
              </Typography>
              <Tooltip title={selectedFile.name}>
                <Typography data-test="file-name" noWrap>
                  {selectedFile.name}
                </Typography>
              </Tooltip>
            </Box>
          )}
        </Stack>
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
