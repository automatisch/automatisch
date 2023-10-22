import phoneNumberCountryCodes from '../../../common/phone-number-country-codes';

const formatPhoneNumber = [
  {
    label: 'Phone Number',
    key: 'phoneNumber',
    type: 'string' as const,
    required: true,
    description: 'The phone number you want to format.',
    variables: true,
  },
  {
    label: 'To Format',
    key: 'toFormat',
    type: 'dropdown' as const,
    required: true,
    description: 'The format you want to convert the number to.',
    variables: true,
    options: [
      { label: '+491632223344 (E164)', value: 'e164' },
      { label: '+49 163 2223344 (International)', value: 'international' },
      { label: '0163 2223344 (National)', value: 'national' },
    ],
  },
  {
    label: 'Phone Number Country Code',
    key: 'phoneNumberCountryCode',
    type: 'dropdown' as const,
    required: true,
    description: 'The country code of the phone number. The default is US.',
    variables: true,
    options: phoneNumberCountryCodes,
  },
];

export default formatPhoneNumber;
