import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Switch from 'components/Switch';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import Form from 'components/Form';
import useFormatMessage from 'hooks/useFormatMessage';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import { UPDATE_CONFIG } from 'graphql/mutations/update-config.ee';
import { useQueryClient } from '@tanstack/react-query';

function AuthenticationConfig() {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const queryClient = useQueryClient();
  const { data, isLoading: isAutomatischConfigLoading } =
    useAutomatischConfig();
  const automatischConfig = data?.data;

  const [
    updateConfig,
    { loading: updateConfigLoading },
  ] = useMutation(UPDATE_CONFIG);

  const handleSubmit = async (values) => {
    try {
      await updateConfig({
        variables: {
          input: {
            'userManagement.preventUsersFromUpdatingTheirProfile': values.userManagement.preventUsersFromUpdatingTheirProfile,
          },
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ['automatisch', 'config'],
      });

      enqueueSnackbar(formatMessage('authenticationConfig.successfullySaved'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-update-role-mappings-success',
        },
      });
    } catch (error) {
      throw new Error('Failed while saving!');
    }
  };

  if (isAutomatischConfigLoading) {
    return null;
  }

  return (
    <>
      <Typography variant="h4">
        {formatMessage('authenticationConfig.title')}
      </Typography>

      <Form defaultValues={automatischConfig} onSubmit={handleSubmit}>
        <Stack direction="column" spacing={2}>
          <Switch
            name="userManagement.preventUsersFromUpdatingTheirProfile"
            label={<>
              {formatMessage('authenticationConfig.userManagementPreventUsersFromUpdatingTheirProfile')}

              <Tooltip
                title={formatMessage('authenticationConfig.userManagementPreventUsersFromUpdatingTheirProfileTooltip')}
                sx={{ ml: 1 }}
              >
                <InfoOutlinedIcon />
              </Tooltip>
            </>}
          />

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ boxShadow: 2 }}
            loading={updateConfigLoading}
          >
            {formatMessage('authenticationConfig.save')}
          </LoadingButton>
        </Stack>
      </Form>
    </>
  );
}

AuthenticationConfig.propTypes = {
};

export default AuthenticationConfig;
