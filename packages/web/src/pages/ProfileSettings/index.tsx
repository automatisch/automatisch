import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';

const StyledForm = styled(Form)`
  display: flex;
  align-items: end;
  flex-direction: column;
`;

function ProfileSettings() {
  const formatMessage = useFormatMessage();

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={9} md={6}>
        <Grid item xs={12} sx={{ mb: [2, 5] }} >
          <PageTitle>
            {formatMessage('profileSettings.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end">
          <StyledForm>
            <TextField
              fullWidth
              name="email"
              label={formatMessage('profileSettings.email')}
              margin="normal"
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
            >
              {formatMessage('profileSettings.updateEmail')}
            </Button>
          </StyledForm>

          <StyledForm>
            <TextField
              fullWidth
              name="password"
              label={formatMessage('profileSettings.newPassword')}
              margin="normal"
            />

            <TextField
              fullWidth
              name="confirmPassword"
              label={formatMessage('profileSettings.confirmNewPassword')}
              margin="normal"
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              type="submit"
            >
              {formatMessage('profileSettings.updatePassword')}
            </Button>
          </StyledForm>
        </Grid>
      </Grid>
    </Container>
  );
}

export default ProfileSettings;
