import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import { getUnifiedErrorMessage } from 'helpers/errors';
import useTemplates from 'hooks/useTemplates.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import TemplateItem from './TemplateItem/TemplateItem.ee';
import NoResultFound from 'components/NoResultFound';

export default function TemplatesDialog(props) {
  const { open = true } = props;

  const formatMessage = useFormatMessage();
  const navigate = useNavigate();

  const { data: templates } = useTemplates();

  const handleClose = () => {
    navigate('..');
  };

  return (
    <Dialog open={open} onClose={handleClose} data-test="templates-dialog">
      <DialogTitle>{formatMessage('templatesDialog.title')}</DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent>
        <DialogContentText mb={2}>
          {templates?.meta.count !== 0 &&
            formatMessage('templatesDialog.description')}

          {templates?.meta.count === 0 &&
            formatMessage('adminTemplatesPage.noResult')}
        </DialogContentText>

        {templates?.data.map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
            to={URLS.CREATE_FLOW_FROM_TEMPLATE(template.id)}
          />
        ))}
      </DialogContent>
    </Dialog>
  );
}
