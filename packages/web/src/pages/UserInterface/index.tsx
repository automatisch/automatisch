import * as React from 'react';
import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'notistack';

import { UPDATE_CONFIG } from 'graphql/mutations/update-config.ee';
import useConfig from 'hooks/useConfig';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import Form from 'components/Form';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import ColorInput from 'components/ColorInput';
import nestObject from 'helpers/nestObject';
import { Skeleton } from '@mui/material';

type UserInterface = {
  palette: {
    primary: {
      dark: string;
      light: string;
      main: string;
    };
  };
  logo: {
    svgData: string;
  };
};

export default function UserInterface(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [updateConfig, { loading }] = useMutation(UPDATE_CONFIG, {
    refetchQueries: ['GetConfig'],
  });
  const { config, loading: configLoading } = useConfig([
    'palette.primary.main',
    'palette.primary.light',
    'palette.primary.dark',
    'logo.svgData',
  ]);
  const { enqueueSnackbar } = useSnackbar();

  const handleUserInterfaceUpdate = async (uiData: Partial<UserInterface>) => {
    try {
      await updateConfig({
        variables: {
          input: {
            'palette.primary.main': uiData?.palette?.primary.main,
            'palette.primary.dark': uiData?.palette?.primary.dark,
            'palette.primary.light': uiData?.palette?.primary.light,
            'logo.svgData': uiData?.logo?.svgData,
          },
        },
      });

      enqueueSnackbar(formatMessage('userInterfacePage.successfullyUpdated'), {
        variant: 'success',
      });
    } catch (error) {
      throw new Error('Failed while updating!');
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('userInterfacePage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          {configLoading && (
            <Stack direction="column" gap={2}>
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={55} />
              <Skeleton variant="rounded" height={85} />
              <Skeleton variant="rounded" height={45} />
            </Stack>
          )}
          {!configLoading && (
            <Form
              onSubmit={handleUserInterfaceUpdate}
              defaultValues={nestObject<UserInterface>(config)}
            >
              <Stack direction="column" gap={2}>
                <ColorInput
                  name="palette.primary.main"
                  label={formatMessage('userInterfacePage.mainColor')}
                  fullWidth
                />

                <ColorInput
                  name="palette.primary.dark"
                  label={formatMessage('userInterfacePage.darkColor')}
                  fullWidth
                />

                <ColorInput
                  name="palette.primary.light"
                  label={formatMessage('userInterfacePage.lightColor')}
                  fullWidth
                />

                <TextField
                  name="logo.svgData"
                  label={formatMessage('userInterfacePage.svgData')}
                  multiline
                  fullWidth
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={loading}
                >
                  {formatMessage('userInterfacePage.submit')}
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
