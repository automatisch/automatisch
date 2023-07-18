import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Typography from '@mui/material/Typography';
import type { AlertProps } from '@mui/material/Alert';

import { generateExternalLink } from '../../helpers/translationValues';
import { WEBHOOK_DOCS } from '../../config/urls';
import TextField from '../TextField';
import { Alert } from './style';

type WebhookUrlInfoProps = {
  webhookUrl: string;
} & AlertProps;

function WebhookUrlInfo(props: WebhookUrlInfoProps): React.ReactElement {
  const { webhookUrl, ...alertProps } = props;

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
            values={{ link: generateExternalLink(WEBHOOK_DOCS) }}
          />
        }
      />
    </Alert>
  );
}

export default WebhookUrlInfo;
