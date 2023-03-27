import { useQuery } from '@apollo/client';
import { TInvoice } from '@automatisch/types';

import { GET_INVOICES } from 'graphql/queries/get-invoices.ee';

type UseInvoicesReturn = {
  invoices: TInvoice[],
  loading: boolean;
};

export default function useInvoices(): UseInvoicesReturn {
  const { data, loading } = useQuery(GET_INVOICES);

  return {
    invoices: data?.getInvoices || [],
    loading: loading
  };
}
