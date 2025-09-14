import { Hotel } from '@/types/hotel';

interface PropertyRulesSectionProps {
  hotel: Hotel;
}

export const PropertyRulesSection: React.FC<PropertyRulesSectionProps> = ({ hotel }) => {
  const defaultRules = [
    { type: 'RESTRICTIONS', description: 'Check In: 2 PM' },
    { type: 'RESTRICTIONS', description: 'Check Out: 11 AM' },
    { type: 'RESTRICTIONS', description: 'Pets are not allowed' },
    {
      type: 'RESTRICTIONS',
      description:
        'Optional : Airport shuttle fee: INR 2500 per vehicle (one-way, maximum occupancy 4)|Rollaway bed fee: INR 300.0 per night',
    },
    {
      type: 'RESTRICTIONS',
      description: 'Extra-person charges may apply and vary depending on property policy',
    },
  ];

  const rules =
    hotel.propertyRules && hotel.propertyRules.length > 0 ? hotel.propertyRules : defaultRules;

  return (
    <div className="mt-12 pb-8 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Property Rules</h2>

      {/* Property Rules Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex min-w-max">
          <button className="px-6 py-3 bg-[#FF8B02] text-white font-medium rounded-t-lg">
            RESTRICTIONS
          </button>
        </div>
      </div>

      {/* Property Rules Content */}
      <div className="space-y-4 text-gray-700">
        <ul className="list-disc pl-5 space-y-4">
          {rules.map((rule, idx) => (
            <li key={idx} className="flex items-baseline">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-700 mr-3 mt-2 shrink-0"></span>
              <span>{rule.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
