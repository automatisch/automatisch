import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import client from 'graphql/client';

type ApolloProviderProps = {
  children: React.ReactNode;
};

const ApolloProvider = (props: ApolloProviderProps) => {
  return (
    <BaseApolloProvider client={client} {...props} />
  );
};

export default ApolloProvider;
