import * as React from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import * as URLS from 'config/urls';
import { generateInternalLink } from 'helpers/translationValues';
import useTrialStatus from 'hooks/useTrialStatus.ee';
import useFormatMessage from 'hooks/useFormatMessage';


export default function TrialOverAlert() {
  const formatMessage = useFormatMessage();
  const trialStatus = useTrialStatus();

  if (!trialStatus || !trialStatus.over) return <React.Fragment />;

  return (
    <Alert
      severity="error"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ lineHeight: 1.5 }}>
        {formatMessage('trialOverAlert.text', {
          link: generateInternalLink(URLS.SETTINGS_PLAN_UPGRADE)
        })}
      </Typography>
    </Alert>
  );
}
