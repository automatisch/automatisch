import useAutomatischInfo from 'hooks/useAutomatischInfo';
import useIsCurrentUserAdmin from './useIsCurrentUserAdmin';

export default function useIsCurrentUserEnterpriseAdmin() {
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const { data: automatischInfoData, isAutomatischInfoLoading } =
    useAutomatischInfo();

  const isEnterprise = automatischInfoData?.data.isEnterprise === true;

  // If the data is still loading, we return undefined to indicate that we don't have the information yet.
  if (isAutomatischInfoLoading) return undefined;
  if (isCurrentUserAdmin === undefined) return undefined;

  return isCurrentUserAdmin && isEnterprise;
}
