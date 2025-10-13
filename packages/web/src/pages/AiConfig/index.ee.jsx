import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Alert from '@mui/material/Alert';
import * as React from 'react';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useFormatMessage from 'hooks/useFormatMessage';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';

const AI_PROVIDERS = [
  { value: 'anthropic', label: 'Anthropic (Claude)' },
  { value: 'openai', label: 'OpenAI (GPT)' },
];

export default function AiConfig() {
  const formatMessage = useFormatMessage();
  const { mutateAsync: updateConfig, isPending } = useAdminUpdateConfig();
  const { data: configData, isLoading: configLoading } = useAutomatischConfig();
  const config = configData?.data;

  const enqueueSnackbar = useEnqueueSnackbar();

  const defaultValues = {
    defaultAiProvider: config?.defaultAiProvider || '',
    defaultAiProviderKey: config?.defaultAiProviderKey || '',
  };

  const handleAiConfigUpdate = async (aiData) => {
    try {
      const input = {
        defaultAiProvider: aiData.defaultAiProvider,
        defaultAiProviderKey: aiData.defaultAiProviderKey,
      };

      await updateConfig(input);

      enqueueSnackbar(formatMessage('aiConfigPage.successfullyUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-ai-config-success',
        },
      });
    } catch {
      throw new Error('Failed while updating AI configuration!');
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('aiConfigPage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          {configLoading && (
            <Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={45} />
            </Stack>
          )}
          {!configLoading && (
            <Form onSubmit={handleAiConfigUpdate} defaultValues={defaultValues}>
              <Stack direction="column" gap={2}>
                <Typography variant="h4" gutterBottom={true}>
                  {formatMessage('aiConfigPage.subtitle')}
                </Typography>

                <Alert severity="info" sx={{ mb: 2 }}>
                  {formatMessage('aiConfigPage.description')}
                </Alert>

                <TextField
                  select
                  name="defaultAiProvider"
                  label={formatMessage('aiConfigPage.providerFieldLabel')}
                  fullWidth
                  data-test="ai-provider-select"
                >
                  <MenuItem value="">
                    {formatMessage('aiConfigPage.noProvider')}
                  </MenuItem>
                  {AI_PROVIDERS.map((provider) => (
                    <MenuItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  name="defaultAiProviderKey"
                  label={formatMessage('aiConfigPage.apiKeyFieldLabel')}
                  type="password"
                  fullWidth
                  helperText={formatMessage('aiConfigPage.apiKeyHelperText')}
                  data-test="ai-api-key-field"
                />

                <Alert severity="warning">
                  {formatMessage('aiConfigPage.apiKeyPersistenceNote')}
                </Alert>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2, mt: 2 }}
                  loading={isPending}
                  data-test="update-button"
                >
                  {formatMessage('aiConfigPage.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
