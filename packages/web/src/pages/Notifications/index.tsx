import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import useNotifications from 'hooks/useNotifications';
import Container from 'components/Container';
import NotificationCard from 'components/NotificationCard';
import PageTitle from 'components/PageTitle';
import useFormatMessage from 'hooks/useFormatMessage';

interface INotification {
  name: string;
  createdAt: string;
  documentationUrl: string;
  description: string;
}

export default function Updates(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const { notifications } = useNotifications();

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <PageTitle sx={{ mb: [2, 5] }}>
          {formatMessage('notifications.title')}
        </PageTitle>

        <Stack gap={2}>
          {notifications.map((notification: INotification) => (
            <NotificationCard
              key={notification.name}
              name={`Version ${notification.name}`}
              description={notification.description}
              createdAt={notification.createdAt}
              documentationUrl={notification.documentationUrl}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
