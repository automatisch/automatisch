import { IntlProvider as BaseIntlProvider } from 'react-intl';
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
export default IntlProvider;
