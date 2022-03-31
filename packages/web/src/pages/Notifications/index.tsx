import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import appConfig from 'config/app';
import Container from 'components/Container';
import NotificationCard from 'components/NotificationCard';
import PageTitle from 'components/PageTitle';
import useFormatMessage from 'hooks/useFormatMessage';

interface IUpdate {
  name: string;
  createdAt: string;
  documentationUrl: string;
  description: string;
}

export default function Updates(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [updates, setUpdates] = React.useState<IUpdate[]>([]);

  React.useEffect(() => {
    fetch(`${appConfig.notificationsUrl}/notifications.json`)
      .then((response) => response.json())
      .then((updates) => {
        if (Array.isArray(updates) && updates.length) {
          setUpdates(updates);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <PageTitle sx={{ mb: [2, 5] }}>
          {formatMessage('notifications.title')}
        </PageTitle>

        <Stack
          gap={2}
        >
          {updates.map((update: IUpdate) => (
            <NotificationCard
              key={update.name}
              name={`Version ${update.name}`}
              description={update.description}
              createdAt={update.createdAt}
              documentationUrl={update.documentationUrl}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};
