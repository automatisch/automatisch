import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useAppConfig from 'hooks/useAppConfig.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import Form from 'components/Form';
import { Switch } from './style';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
import useAdminUpdateAppConfig from 'hooks/useAdminUpdateAppConfig';
import useApp from 'hooks/useApp';

function AdminApplicationSettings({ appKey }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const { data: appData, loading: appLoading } = useApp(appKey);
  const app = appData?.data || {};

  const { data: appConfig, isLoading: loading } = useAppConfig(appKey);

  const { mutateAsync: createAppConfig, isPending: isCreateAppConfigPending } =
    useAdminCreateAppConfig(appKey);

  const { mutateAsync: updateAppConfig, isPending: isUpdateAppConfigPending } =
    useAdminUpdateAppConfig(appKey);

  const handleSubmit = async (values) => {
    try {
      if (!appConfig?.data) {
        await createAppConfig(values);
      } else {
        await updateAppConfig(values);
      }

      enqueueSnackbar(formatMessage('adminAppsSettings.successfullySaved'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-save-admin-apps-settings-success',
        },
      });
    } catch {
      throw new Error('Failed while saving!');
    }
  };

  const defaultValues = useMemo(
    () => ({
      ...(app.supportsOauthClients && {
        useOnlyPredefinedAuthClients:
          appConfig?.data?.useOnlyPredefinedAuthClients || false,
      }),
      disabled: appConfig?.data?.disabled || false,
    }),
    [appConfig?.data, app.supportsOauthClients],
  );

  return (
    <Form
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      render={({ formState: { isDirty } }) => (
        <Paper sx={{ p: 2, mt: 4 }}>
          <Stack spacing={2} direction="column">
            {app.supportsOauthClients && (
              <>
                <Switch
                  name="useOnlyPredefinedAuthClients"
                  label={formatMessage(
                    'adminAppsSettings.useOnlyPredefinedAuthClients',
                  )}
                  FormControlLabelProps={{
                    labelPlacement: 'start',
                  }}
                />

                <Divider />
              </>
            )}

            <Switch
              name="disabled"
              label={formatMessage('adminAppsSettings.disabled')}
              FormControlLabelProps={{
                labelPlacement: 'start',
              }}
            />
            <Divider />
          </Stack>

          <Stack>
            <LoadingButton
              data-test="submit-button"
              type="submit"
              variant="contained"
              color="primary"
              sx={{ boxShadow: 2, mt: 5 }}
              loading={isCreateAppConfigPending || isUpdateAppConfigPending}
              disabled={!isDirty || loading || appLoading}
            >
              {formatMessage('adminAppsSettings.save')}
            </LoadingButton>
          </Stack>
        </Paper>
      )}
    ></Form>
  );
}

AdminApplicationSettings.propTypes = {
  appKey: PropTypes.string.isRequired,
};

export default AdminApplicationSettings;
