import PropTypes from 'prop-types';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import { generateExternalLink } from 'helpers/translationValues';
import { WEBHOOK_DOCS_PATH } from 'config/urls';
import TextField from 'components/TextField';
import useDocsUrl from 'hooks/useDocsUrl';
import { Alert } from './style';

function WebhookUrlInfo(props) {
  const { webhookUrl, ...alertProps } = props;
  const webhookDocsUrl = useDocsUrl(WEBHOOK_DOCS_PATH);

  return (
    <Alert icon={false} color="info" {...alertProps}>
      <Typography variant="body2" textAlign="center">
        <FormattedMessage id="webhookUrlInfo.title" />
      </Typography>

      <Typography variant="body1" textAlign="center">
        <FormattedMessage id="webhookUrlInfo.description" />
      </Typography>

      <TextField
        readOnly
        clickToCopy={true}
        name="webhookUrl"
        fullWidth
        defaultValue={webhookUrl}
        helperText={
          <FormattedMessage
            id="webhookUrlInfo.helperText"
            values={{ link: generateExternalLink(webhookDocsUrl) }}
          />
        }
      />
    </Alert>
  );
}

WebhookUrlInfo.propTypes = {
  webhookUrl: PropTypes.string.isRequired,
};
export default WebhookUrlInfo;
