import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface CancellationPolicy {
  type: string;
  description: string;
}

interface BookingPolicyProps {
  cancellationPolicies: CancellationPolicy[];
  termsAndConditions: string[];
}

export const BookingPolicy: React.FC<BookingPolicyProps> = ({
  cancellationPolicies,
  termsAndConditions,
}) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Booking Policy</h2>

      {/* Cancellation Policy */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Cancellation Policy</h3>
        <div className="space-y-4">
          {cancellationPolicies.map((policy, index) => (
            <div key={index} className="flex items-start gap-3">
              <FiAlertCircle className="w-5 h-5 text-orange-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">{policy.type}</p>
                <p className="text-gray-600">{policy.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Terms & Conditions</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          {termsAndConditions.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 