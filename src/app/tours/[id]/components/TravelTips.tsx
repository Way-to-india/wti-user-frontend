import React from 'react';

interface TravelTipsSectionProps {
  travelTips: string[];
  name: string;
}

const TravelTipsSection: React.FC<TravelTipsSectionProps> = ({ travelTips, name }) => {
  if (!travelTips || travelTips.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <p className="text-gray-500">No travel tips available for this tour.</p>
      </div>
    );
  }

  // Filter out duplicate or very similar entries
  const uniqueTips = travelTips.filter((tip, index, self) => {
    // Skip if it's a title that appears again in the list
    if (tip.endsWith(':') && self.some((t, i) => i !== index && t.includes(tip))) {
      return false;
    }
    return tip.trim().length > 0;
  });

  // Group tips by section if they have headers
  const groupedTips: { header?: string; items: string[] }[] = [];
  let currentGroup: { header?: string; items: string[] } = { items: [] };

  uniqueTips.forEach(tip => {
    if (tip.endsWith(':')) {
      // This is a header
      if (currentGroup.items.length > 0) {
        groupedTips.push(currentGroup);
      }
      currentGroup = { header: tip.replace(':', ''), items: [] };
    } else {
      currentGroup.items.push(tip);
    }
  });

  if (currentGroup.items.length > 0) {
    groupedTips.push(currentGroup);
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{name}</h2>

        <div className="space-y-4">
          {groupedTips.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="border-2 border-dashed border-gray-400 p-4 bg-gray-100"
            >
              {group.header && (
                <h3 className="text-base font-semibold text-gray-900 mb-3 underline">
                  {group.header}
                </h3>
              )}
              <div className="space-y-2">
                {group.items.map((tip, tipIndex) => (
                  <p key={tipIndex} className="text-sm text-gray-800 leading-relaxed">
                    · {tip}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelTipsSection;
