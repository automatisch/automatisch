import englishMessages from 'locales/en.json';
import { IntlProvider as BaseIntlProvider } from 'react-intl';

type IntlProviderProps = {
  children: React.ReactNode;
};

const IntlProvider = ({ children }: IntlProviderProps) => {
  return (
    <BaseIntlProvider locale={navigator.language} defaultLocale="en" messages={englishMessages}>
      {children}
    </BaseIntlProvider>
  );
};

export default IntlProvider;
