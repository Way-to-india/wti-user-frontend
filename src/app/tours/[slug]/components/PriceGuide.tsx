import React from 'react';

interface PriceGuideItem {
  title: string;
  value: number;
}

interface PriceGuideDetailProps {
  priceGuide?: PriceGuideItem[];
}

const PriceGuideDetail: React.FC<PriceGuideDetailProps> = ({ priceGuide = [] }) => {
  if (!priceGuide || priceGuide.length === 0) {
    return null;
  }

  const roomSharingItems = priceGuide.filter(
    item => item.title.includes('Persons') && item.title.includes('Room')
  );

  const vehicleTerms = priceGuide.filter(
    item =>
      item.title.includes('AC') || item.title.includes('vehicle') || item.title.includes('Tempo')
  );

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-normal text-gray-600 mb-8">Price Guide detail</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roomSharingItems.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-normal text-gray-700 mb-4 pb-2 border-b border-dashed border-gray-400">
                Room Sharing Basis
              </h3>
              <ul className="space-y-2">
                {roomSharingItems.map((item, index) => (
                  <li key={index} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {vehicleTerms.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-normal text-gray-700 mb-4 pb-2 border-b border-dashed border-gray-400">
                Special Terms Related to Vehicle
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-800 flex items-start">
                  <span className="mr-2">•</span>
                  <span>Transportation as per itinerary only (not available at disposal).</span>
                </li>
                {vehicleTerms.map((item, index) => (
                  <li key={index} className="text-sm text-gray-800 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceGuideDetail;
