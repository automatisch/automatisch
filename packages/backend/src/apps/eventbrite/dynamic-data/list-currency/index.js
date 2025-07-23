export default {
  name: 'List currency',
  key: 'listCurrency',

  async run() {
    const currencies = {
      data: [
        { value: 'USD', name: 'US Dollar (USD)' },
        { value: 'EUR', name: 'Euro (EUR)' },
        { value: 'GBP', name: 'British Pound (GBP)' },
        { value: 'CAD', name: 'Canadian Dollar (CAD)' },
        { value: 'AUD', name: 'Australian Dollar (AUD)' },
        { value: 'JPY', name: 'Japanese Yen (JPY)' },
        { value: 'CHF', name: 'Swiss Franc (CHF)' },
        { value: 'SEK', name: 'Swedish Krona (SEK)' },
        { value: 'DKK', name: 'Danish Krone (DKK)' },
        { value: 'NOK', name: 'Norwegian Krone (NOK)' },
        { value: 'NZD', name: 'New Zealand Dollar (NZD)' },
        { value: 'MXN', name: 'Mexican Peso (MXN)' },
        { value: 'SGD', name: 'Singapore Dollar (SGD)' },
        { value: 'HKD', name: 'Hong Kong Dollar (HKD)' },
        { value: 'PLN', name: 'Polish Zloty (PLN)' },
        { value: 'BRL', name: 'Brazilian Real (BRL)' },
        { value: 'INR', name: 'Indian Rupee (INR)' },
        { value: 'KRW', name: 'South Korean Won (KRW)' },
        { value: 'CNY', name: 'Chinese Yuan (CNY)' },
        { value: 'RUB', name: 'Russian Ruble (RUB)' },
      ],
    };

    return currencies;
  },
};