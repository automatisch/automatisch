import { useQuery } from '@apollo/client';
import { IPermissionCatalog } from '@automatisch/types';

import { GET_PERMISSION_CATALOG } from 'graphql/queries/get-permission-catalog.ee';

export default function usePermissionCatalog(): IPermissionCatalog {
  const { data } = useQuery(GET_PERMISSION_CATALOG);

  return data?.getPermissionCatalog;
}
