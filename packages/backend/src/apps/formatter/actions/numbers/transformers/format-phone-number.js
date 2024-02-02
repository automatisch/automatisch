import parsePhoneNumber from 'libphonenumber-js';

const formatPhoneNumber = ($) => {
  const phoneNumber = $.step.parameters.phoneNumber;
  const toFormat = $.step.parameters.toFormat;
  const phoneNumberCountryCode =
    $.step.parameters.phoneNumberCountryCode || 'US';

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
