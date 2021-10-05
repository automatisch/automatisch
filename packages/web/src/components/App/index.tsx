import { FormattedMessage } from 'react-intl';
import Layout from 'components/Layout';

export default function App() {
  return (
    <Layout>
      <FormattedMessage id="welcomeText" />
    </Layout>
  );
}
