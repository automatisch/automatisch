import { IntlProvider as BaseIntlProvider } from 'react-intl';
import englishMessages from 'locales/en.json';

type IntlProviderProps = {
  children: React.ReactNode;
};

const IntlProvider = ({ children }: IntlProviderProps): React.ReactElement => {
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
