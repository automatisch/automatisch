import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useAuthentication from 'hooks/useAuthentication';
import Layout from 'components/Layout';
import PublicLayout from 'components/PublicLayout';

export default function NoResultFound() {
  const formatMessage = useFormatMessage();
  const { isAuthenticated } = useAuthentication();
  const pageContent = (
    <Stack
      justifyContent="center"
      alignItems="center"
      flex={1}
      spacing={1}
      p={2}
      mb={11}
    >
      <Typography variant="h1" color="primary" textAlign="center">
        404
      </Typography>
      <Typography variant="body1" textAlign="center">
        {formatMessage('notFoundPage.title')}
      </Typography>
      <Link to={isAuthenticated ? URLS.FLOWS : URLS.LOGIN}>
        <Button variant="contained" sx={{ mt: 3 }} component="div">
          {formatMessage('notFoundPage.button')}
        </Button>
      </Link>
    </Stack>
  );

  return isAuthenticated ? (
    <Layout>{pageContent}</Layout>
  ) : (
    <PublicLayout>{pageContent}</PublicLayout>
  );
}
