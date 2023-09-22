import { useQuery } from '@apollo/client';
import { IApp } from '@automatisch/types';

import { GET_APPS } from 'graphql/queries/get-apps';

type QueryResponse = {
  getApps: IApp[];
};

type UseAppsVariables = {
  name?: string;
  onlyWithTriggers?: boolean;
  onlyWithActions?: boolean;
};

export default function useApps(variables?: UseAppsVariables) {
  const { data, loading } = useQuery<QueryResponse>(GET_APPS, {
    variables,
  });
  const apps = data?.getApps;

  return {
    apps,
    loading,
  };
}
