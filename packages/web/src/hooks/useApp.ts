import { useQuery } from '@apollo/client';
import { IApp } from '@automatisch/types';

import { GET_APP } from 'graphql/queries/get-app';

type QueryResponse = {
  getApp: IApp;
}

export default function useApp(key: string) {
  const {
    data,
    loading
  } = useQuery<QueryResponse>(
    GET_APP,
    {
      variables: { key }
    }
  );
  const app = data?.getApp;

  return {
    app,
    loading,
  };
}
