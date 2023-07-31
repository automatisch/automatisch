import { useQuery } from '@apollo/client';
import { IPermissionCatalog } from '@automatisch/types';

import { GET_PERMISSION_CATALOG } from 'graphql/queries/get-permission-catalog.ee';

type UsePermissionCatalogReturn = {
  permissionCatalog: IPermissionCatalog;
  loading: boolean;
};

export default function usePermissionCatalog(): UsePermissionCatalogReturn {
  const { data, loading } = useQuery(GET_PERMISSION_CATALOG);

  return { permissionCatalog: data?.getPermissionCatalog, loading };
}
