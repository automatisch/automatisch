import Box from '@mui/material/Box';
import Container from 'components/Container';
import PageTitle from 'components/PageTitle';
import AppRow from 'components/AppRow';

export default function Applications() {
  return (
    <Box sx={{ py: 3 }}>
      <Container>
        <PageTitle>Applications</PageTitle>

        <AppRow name="Google Calendar" />
        <AppRow name="Slack" />
        <AppRow name="Twitch" />
        <AppRow name="Twitter" />
      </Container>
    </Box>
  );
};
