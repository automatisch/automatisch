import { useQuery } from '@apollo/client';
import { GET_INVOICES } from 'graphql/queries/get-invoices.ee';
export default function useInvoices() {
  const { data, loading } = useQuery(GET_INVOICES);
  return {
    invoices: data?.getInvoices || [],
    loading: loading,
  };
}
