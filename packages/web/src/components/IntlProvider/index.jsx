import { IntlProvider as BaseIntlProvider } from 'react-intl';
import PropTypes from 'prop-types';

import englishMessages from 'locales/en.json';

const IntlProvider = ({ children }) => {
  return (
    <BaseIntlProvider
      locale={navigator.language}
      defaultLocale="en"
      messages={englishMessages}
    >
      {children}
    </BaseIntlProvider>
  );
};

IntlProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default IntlProvider;
