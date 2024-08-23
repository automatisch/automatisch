import useAutomatischConfig from 'hooks/useAutomatischConfig';

export default function usePreventUsersFromUpdatingTheirProfile() {
  const { data, isSuccess } =
    useAutomatischConfig();
  const automatischConfig = data?.data;

  const preventUsersFromUpdatingTheirProfile = isSuccess ? automatischConfig['userManagement.preventUsersFromUpdatingTheirProfile'] : false;

  console.log('preventUsersFromUpdatingTheirProfile', preventUsersFromUpdatingTheirProfile, automatischConfig)

  return preventUsersFromUpdatingTheirProfile;
}
