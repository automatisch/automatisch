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

function AdminApplicationSettings(props) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const { data: appConfig, isLoading: loading } = useAppConfig(props.appKey);

  const { mutateAsync: createAppConfig, isPending: isCreateAppConfigPending } =
    useAdminCreateAppConfig(props.appKey);

  const { mutateAsync: updateAppConfig, isPending: isUpdateAppConfigPending } =
    useAdminUpdateAppConfig(props.appKey);

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
    } catch (error) {
      throw new Error('Failed while saving!');
    }
  };

  const defaultValues = useMemo(
    () => ({
      customConnectionAllowed:
        appConfig?.data?.customConnectionAllowed || false,
      shared: appConfig?.data?.shared || false,
      disabled: appConfig?.data?.disabled || false,
    }),
    [appConfig?.data],
  );

  return (
    <Form
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      render={({ formState: { isDirty } }) => (
        <Paper sx={{ p: 2, mt: 4 }}>
          <Stack spacing={2} direction="column">
            <Switch
              name="customConnectionAllowed"
              label={formatMessage('adminAppsSettings.customConnectionAllowed')}
              FormControlLabelProps={{
                labelPlacement: 'start',
              }}
            />
            <Divider />
            <Switch
              name="shared"
              label={formatMessage('adminAppsSettings.shared')}
              FormControlLabelProps={{
                labelPlacement: 'start',
              }}
            />
            <Divider />
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
              disabled={!isDirty || loading}
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
