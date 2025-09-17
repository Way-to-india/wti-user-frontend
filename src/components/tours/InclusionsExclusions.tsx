import React from 'react';
import { FiCheck, FiX } from 'react-icons/fi';

interface InclusionExclusionItem {
  title: string;
  description?: string;
}

interface InclusionsExclusionsProps {
  inclusions: InclusionExclusionItem[];
  exclusions: InclusionExclusionItem[];
}

export const InclusionsExclusions: React.FC<InclusionsExclusionsProps> = ({
  inclusions,
  exclusions,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Inclusions & Exclusions</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-green-600">Inclusions</h3>
        <div className="space-y-3">
          {inclusions.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <FiCheck className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p className="text-gray-800 font-medium">{item.title}</p>
                {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>{' '}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-red-600">Exclusions</h3>
        <div className="space-y-3">
          {exclusions.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <FiX className="w-5 h-5 text-red-500 mt-1" />
              <div>
                <p className="text-gray-800 font-medium">{item.title}</p>
                {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
