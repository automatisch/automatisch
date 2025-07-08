import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import mergeWith from 'lodash/mergeWith';
import * as React from 'react';

import Switch from 'components/Switch';
import ColorInput from 'components/ColorInput';
import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useFormatMessage from 'hooks/useFormatMessage';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import {
  primaryDarkColor,
  primaryLightColor,
  primaryMainColor,
} from 'styles/theme';

const getPrimaryMainColor = (color) => color || primaryMainColor;
const getPrimaryDarkColor = (color) => color || primaryDarkColor;
const getPrimaryLightColor = (color) => color || primaryLightColor;

const defaultValues = {
  title: 'Automatisch',
  palettePrimaryMain: primaryMainColor,
  palettePrimaryDark: primaryDarkColor,
  palettePrimaryLight: primaryLightColor,
  logoSvgData: '',
  enableFooter: false,
  footerLogoSvgData: '',
  footerCopyrightText: '',
  footerBackgroundColor: '#FFFFFF',
  footerTextColor: '#000000',
  footerDocsUrl: '',
  footerTosUrl: '',
  footerPrivacyPolicyUrl: '',
  footerImprintUrl: '',
};

const mergeIfGiven = (oldValue, newValue) => {
  if (newValue) {
    return newValue;
  }

  return oldValue;
};

export default function UserInterface() {
  const formatMessage = useFormatMessage();
  const { mutateAsync: updateConfig, isPending } = useAdminUpdateConfig();
  const { data: configData, isLoading: configLoading } = useAutomatischConfig();
  const config = configData?.data;

  const enqueueSnackbar = useEnqueueSnackbar();
  const configWithDefaults = mergeWith(defaultValues, config, mergeIfGiven);

  const handleUserInterfaceUpdate = async (uiData) => {
    try {
      const input = {
        enableFooter: uiData.enableFooter,
        footerBackgroundColor: uiData.footerBackgroundColor,
        footerCopyrightText: uiData.footerCopyrightText,
        footerDocsUrl: uiData.footerDocsUrl,
        footerImprintUrl: uiData.footerImprintUrl,
        footerLogoSvgData: uiData.footerLogoSvgData,
        footerPrivacyPolicyUrl: uiData.footerPrivacyPolicyUrl,
        footerTextColor: uiData.footerTextColor,
        footerTosUrl: uiData.footerTosUrl,
        logoSvgData: uiData.logoSvgData,
        palettePrimaryDark: getPrimaryDarkColor(uiData.palettePrimaryDark),
        palettePrimaryLight: getPrimaryLightColor(uiData.palettePrimaryLight),
        palettePrimaryMain: getPrimaryMainColor(uiData.palettePrimaryMain),
        title: uiData.title,
      };

      await updateConfig(input);

      enqueueSnackbar(formatMessage('userInterfacePage.successfullyUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-user-interface-success',
        },
      });
    } catch {
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
                <Typography variant="h4" gutterBottom={true}>
                  {formatMessage('userInterfacePage.generalTitle')}
                </Typography>

                <TextField
                  name="title"
                  label={formatMessage('userInterfacePage.titleFieldLabel')}
                  fullWidth
                />

                <ColorInput
                  name="palettePrimaryMain"
                  label={formatMessage(
                    'userInterfacePage.primaryMainColorFieldLabel',
                  )}
                  fullWidth
                  data-test="primary-main-color-input"
                />

                <ColorInput
                  name="palettePrimaryDark"
                  label={formatMessage(
                    'userInterfacePage.primaryDarkColorFieldLabel',
                  )}
                  fullWidth
                  data-test="primary-dark-color-input"
                />

                <ColorInput
                  name="palettePrimaryLight"
                  label={formatMessage(
                    'userInterfacePage.primaryLightColorFieldLabel',
                  )}
                  fullWidth
                  data-test="primary-light-color-input"
                />

                <TextField
                  name="logoSvgData"
                  label={formatMessage('userInterfacePage.svgDataFieldLabel')}
                  multiline
                  fullWidth
                  data-test="logo-svg-data-text-field"
                />

                <Typography variant="h4" gutterBottom={true} mt={3}>
                  {formatMessage('userInterfacePage.footerTitle')}
                </Typography>

                <Switch
                  name="enableFooter"
                  label={formatMessage('userInterfacePage.enableFooterLabel')}
                />

                <TextField
                  name="footerLogoSvgData"
                  label={formatMessage(
                    'userInterfacePage.footerLogoSvgDataFieldLabel',
                  )}
                  multiline
                  fullWidth
                  data-test="footer-logo-svg-data-text-field"
                />

                <TextField
                  name="footerCopyrightText"
                  label={formatMessage(
                    'userInterfacePage.footerCopyrightTextFieldLabel',
                  )}
                  multiline
                  fullWidth
                  data-test="footer-copyright-text-field"
                />

                <ColorInput
                  name="footerBackgroundColor"
                  label={formatMessage(
                    'userInterfacePage.footerBackgroundColorLabel',
                  )}
                  fullWidth
                  data-test="footer-background-color-input"
                />

                <ColorInput
                  name="footerTextColor"
                  label={formatMessage(
                    'userInterfacePage.footerTextColorLabel',
                  )}
                  fullWidth
                  data-test="footer-text-color-input"
                />

                <TextField
                  name="footerDocsUrl"
                  label={formatMessage('userInterfacePage.footerDocsUrlLabel')}
                  multiline
                  fullWidth
                  data-test="logo-docs-text-field"
                />

                <TextField
                  name="footerTosUrl"
                  label={formatMessage('userInterfacePage.footerTosUrlLabel')}
                  multiline
                  fullWidth
                  data-test="logo-tos-url-text-field"
                />

                <TextField
                  name="footerPrivacyPolicyUrl"
                  label={formatMessage(
                    'userInterfacePage.footerPrivacyPolicyUrlLabel',
                  )}
                  multiline
                  fullWidth
                  data-test="logo-privacy-policy-url-text-field"
                />

                <TextField
                  name="footerImprintUrl"
                  label={formatMessage(
                    'userInterfacePage.footerImprintUrlLabel',
                  )}
                  multiline
                  fullWidth
                  data-test="logo-imprint-url-text-field"
                />

                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ boxShadow: 2 }}
                  loading={isPending}
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
