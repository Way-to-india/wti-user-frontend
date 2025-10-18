'use client';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

const TravelToolkit: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();

  const toolkitItems = [
    {
      title: 'Indian Embassies (List)',
      path: '/travel-guide/travel-toolkit/indian-embassies',
    },
    {
      title: 'Currency Converter',
      path: '/travel-guide/travel-toolkit/currency-converter',
    },
    {
      title: 'STD Codes',
      path: '/travel-guide/travel-toolkit/std-codes',
    },
    {
      title: 'ISD Codes',
      path: '/travel-guide/travel-toolkit/isd-codes',
    },
  ];

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
            <span className="text-gray-900">Travel Tool Kit</span>
          </p>
        </div>

        {/* Page Title */}
        <h1
          className="text-4xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: theme.typography.fontFamily.bold }}
        >
          Travel Tool Kit
        </h1>

        {/* List of Links */}
        <ul className="space-y-3">
          {toolkitItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => router.push(item.path)}
                className="text-blue-600 hover:text-blue-800 hover:underline text-base transition-colors"
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TravelToolkit;
