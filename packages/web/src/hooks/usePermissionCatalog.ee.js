import { useQuery } from '@apollo/client';
import { GET_PERMISSION_CATALOG } from 'graphql/queries/get-permission-catalog.ee';
export default function usePermissionCatalog() {
  const { data, loading } = useQuery(GET_PERMISSION_CATALOG);
  return { permissionCatalog: data?.getPermissionCatalog, loading };
}
