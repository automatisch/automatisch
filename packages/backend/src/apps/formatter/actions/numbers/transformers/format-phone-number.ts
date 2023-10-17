import { IGlobalVariable } from '@automatisch/types';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js';

const formatPhoneNumber = ($: IGlobalVariable) => {
  const phoneNumber = $.step.parameters.phoneNumber as string;
  const toFormat = $.step.parameters.toFormat as string;
  const phoneNumberCountryCode = ($.step.parameters.phoneNumberCountryCode ||
    'US') as CountryCode;

  const parsedPhoneNumber = parsePhoneNumber(
    phoneNumber,
    phoneNumberCountryCode
  );

  if (toFormat === 'e164') {
    return parsedPhoneNumber.format('E.164');
  } else if (toFormat === 'international') {
    return parsedPhoneNumber.formatInternational();
  } else if (toFormat === 'national') {
    return parsedPhoneNumber.formatNational();
  }
};

export default formatPhoneNumber;
