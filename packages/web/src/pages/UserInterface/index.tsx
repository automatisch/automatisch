import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import merge from 'lodash/merge';
import * as React from 'react';

import ColorInput from 'components/ColorInput';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import { UPDATE_CONFIG } from 'graphql/mutations/update-config.ee';
import { GET_CONFIG } from 'graphql/queries/get-config.ee';
import nestObject from 'helpers/nestObject';
import useConfig from 'hooks/useConfig';
import useFormatMessage from 'hooks/useFormatMessage';
import {
  primaryDarkColor,
  primaryLightColor,
  primaryMainColor,
} from 'styles/theme';

type UserInterface = {
  palette: {
    primary: {
      dark: string;
      light: string;
      main: string;
    };
  };
  title: string;
  logo: {
    svgData: string;
  };
};

const getPrimaryMainColor = (color?: string) => color || primaryMainColor;
const getPrimaryDarkColor = (color?: string) => color || primaryDarkColor;
const getPrimaryLightColor = (color?: string) => color || primaryLightColor;

const defaultValues = {
  title: 'Automatisch',
  'palette.primary.main': primaryMainColor,
  'palette.primary.dark': primaryDarkColor,
  'palette.primary.light': primaryLightColor,
};

export default function UserInterface(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [updateConfig, { loading }] = useMutation(UPDATE_CONFIG);
  const { config, loading: configLoading } = useConfig([
    'title',
    'palette.primary.main',
    'palette.primary.light',
    'palette.primary.dark',
    'logo.svgData',
  ]);
  const enqueueSnackbar = useEnqueueSnackbar();
  const configWithDefaults = merge(
    {},
    defaultValues,
    nestObject<UserInterface>(config)
  );

  const handleUserInterfaceUpdate = async (uiData: Partial<UserInterface>) => {
    try {
      const input = {
        title: uiData?.title,
        'palette.primary.main': getPrimaryMainColor(
          uiData?.palette?.primary.main
        ),
        'palette.primary.dark': getPrimaryDarkColor(
          uiData?.palette?.primary.dark
        ),
        'palette.primary.light': getPrimaryLightColor(
          uiData?.palette?.primary.light
        ),
        'logo.svgData': uiData?.logo?.svgData,
      };

      await updateConfig({
        variables: {
          input,
        },
        optimisticResponse: {
          updateConfig: input,
        },
        update: async function (cache, { data: { updateConfig } }) {
          const newConfigWithDefaults = merge({}, defaultValues, updateConfig);

          cache.writeQuery({
            query: GET_CONFIG,
            data: {
              getConfig: newConfigWithDefaults,
            },
          });

          cache.writeQuery({
            query: GET_CONFIG,
            data: {
              getConfig: newConfigWithDefaults,
            },
            variables: {
              keys: ['logo.svgData'],
            },
          });

          cache.writeQuery({
            query: GET_CONFIG,
            data: {
              getConfig: newConfigWithDefaults,
            },
            variables: {
              keys: [
                'title',
                'palette.primary.main',
                'palette.primary.light',
                'palette.primary.dark',
                'logo.svgData',
              ],
            },
          });
        },
      });

      enqueueSnackbar(formatMessage('userInterfacePage.successfullyUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-user-interface-success'
        }
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
              defaultValues={configWithDefaults}
            >
              <Stack direction="column" gap={2}>
                <TextField
                  name="title"
                  label={formatMessage('userInterfacePage.titleFieldLabel')}
                  fullWidth
                />

                <ColorInput
                  name="palette.primary.main"
                  label={formatMessage(
                    'userInterfacePage.primaryMainColorFieldLabel'
                  )}
                  fullWidth
                  data-test="primary-main-color-input"
                />

                <ColorInput
                  name="palette.primary.dark"
                  label={formatMessage(
                    'userInterfacePage.primaryDarkColorFieldLabel'
                  )}
                  fullWidth
                  data-test="primary-dark-color-input"
                />

                <ColorInput
                  name="palette.primary.light"
                  label={formatMessage(
                    'userInterfacePage.primaryLightColorFieldLabel'
                  )}
                  fullWidth
                  data-test="primary-light-color-input"
                />

                <TextField
                  name="logo.svgData"
                  label={formatMessage('userInterfacePage.svgDataFieldLabel')}
                  multiline
                  fullWidth
                  data-test="logo-svg-data-text-field"
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={loading}
                  data-test="update-button"
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
