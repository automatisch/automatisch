import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';

import useFormatMessage from 'hooks/useFormatMessage';

interface NotificationCardProps {
  name: string;
  createdAt: string;
  documentationUrl: string;
  description: string;
}

const getHumanlyDate = (timestamp: number) =>
  DateTime.fromMillis(timestamp).toRelative();

export default function NotificationCard(props: NotificationCardProps) {
  const { name, createdAt, documentationUrl, description } = props;

  const formatMessage = useFormatMessage();
  const relativeCreatedAt = getHumanlyDate(new Date(createdAt).getTime());
  const subheader = formatMessage('notification.releasedAt', {
    relativeDate: relativeCreatedAt,
  });

  return (
    <Card>
      <CardActionArea component={'a'} href={documentationUrl} target="_blank">
        <CardHeader
          title={name}
          titleTypographyProps={{ variant: 'h6' }}
          subheader={subheader}
          sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        />

        <CardContent>
          <Typography
            variant="body1"
            color="text.secondary"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
