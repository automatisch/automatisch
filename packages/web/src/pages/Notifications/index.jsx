import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import NotificationCard from 'components/NotificationCard';
import PageTitle from 'components/PageTitle';
import * as URLS from 'config/urls';
import useAutomatischInfo from 'hooks/useAutomatischInfo';
import useFormatMessage from 'hooks/useFormatMessage';
import useNotifications from 'hooks/useNotifications';

export default function Updates() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const { notifications } = useNotifications();
  const { data: automatischInfo, isPending } = useAutomatischInfo();
  const isMation = automatischInfo?.data.isMation;

  React.useEffect(
    function redirectToHomepageInMation() {
      if (!navigate) return;

      if (!isPending && isMation) {
        navigate(URLS.DASHBOARD);
      }
    },
    [isPending, isMation, navigate],
  );

  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <PageTitle sx={{ mb: [2, 5] }}>
          {formatMessage('notifications.title')}
        </PageTitle>

        <Stack gap={2}>
          {notifications.map((notification) => (
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
