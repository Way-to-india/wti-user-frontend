'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { ArrowsDownUp } from '@phosphor-icons/react';

const CurrencyConverter: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [amount, setAmount] = useState<string>('1');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('INR');
  const [result, setResult] = useState<string>('');

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'MXN', name: 'Mexican Peso' },
  ];

  const exchangeRates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.12,
    JPY: 149.5,
    AUD: 1.52,
    CAD: 1.36,
    CHF: 0.88,
    CNY: 7.24,
    SEK: 10.87,
    NZD: 1.64,
    SGD: 1.34,
    HKD: 7.83,
    NOK: 10.88,
    KRW: 1329.5,
    TRY: 28.75,
    RUB: 92.5,
    BRL: 4.97,
    ZAR: 18.65,
    MXN: 17.12,
  };

  const handleConvert = () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setResult('Please enter a valid amount');
      return;
    }

    const fromRate = exchangeRates[fromCurrency];
    const toRate = exchangeRates[toCurrency];
    const convertedAmount = (amountNum / fromRate) * toRate;

    setResult(`${amountNum} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult('');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Orange Header Bar */}
      <div className="w-full h-2 bg-orange-500"></div>

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            <button
              onClick={() => router.push('/')}
              className="hover:text-orange-500 transition-colors"
            >
              Home
            </button>
            {' » '}
            <span className="text-gray-900">Currency Converter</span>
          </p>
        </div>

        {/* Page Title */}
        <h1
          className="text-4xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: theme.typography.fontFamily.bold }}
        >
          Currency Converter
        </h1>

        {/* Converter Card */}
        <div className="max-w-2xl bg-gray-50 rounded-lg p-8 shadow-sm">
          <div className="space-y-6">
            {/* Amount Input */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
                placeholder="Enter amount"
              />
            </div>

            {/* From Currency */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                From
              </label>
              <select
                value={fromCurrency}
                onChange={e => setFromCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
              >
                <ArrowsDownUp size={24} weight="bold" />
              </button>
            </div>

            {/* To Currency */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                To
              </label>
              <select
                value={toCurrency}
                onChange={e => setToCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Convert Button */}
            <button
              onClick={handleConvert}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
              style={{ fontFamily: theme.typography.fontFamily.bold }}
            >
              Convert
            </button>

            {/* Result */}
            {result && (
              <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
                <p
                  className="text-lg text-gray-900 text-center font-medium"
                  style={{ fontFamily: theme.typography.fontFamily.bold }}
                >
                  {result}
                </p>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p
              className="text-xs text-gray-500 text-center"
              style={{ fontFamily: theme.typography.fontFamily.regular }}
            >
              Exchange rates are approximate and for reference only. Please check with your bank or
              financial institution for actual rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
