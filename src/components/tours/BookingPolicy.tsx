import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiXCircle, FiClock, FiDollarSign } from 'react-icons/fi';

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
  // Default cancellation policies if none provided
  const defaultCancellationPolicies: CancellationPolicy[] = [
    {
      type: '30+ Days Before Departure',
      description:
        '75% refund of the total booking amount. A processing fee of 5% will be deducted.',
    },
    {
      type: '15-29 Days Before Departure',
      description: '50% refund of the total booking amount. Cancellation charges apply.',
    },
    {
      type: '7-14 Days Before Departure',
      description: '25% refund of the total booking amount. Higher cancellation charges apply.',
    },
    {
      type: 'Less Than 7 Days',
      description: 'No refund. Full payment is non-refundable.',
    },
  ];

  // Default terms and conditions if none provided
  const defaultTermsAndConditions: string[] = [
    'A deposit of 25% is required at the time of booking to confirm your reservation.',
    'Full payment must be received at least 30 days before the departure date.',
    'All bookings are subject to availability and confirmation by our team.',
    'Prices are subject to change due to currency fluctuations, fuel surcharges, or government taxes.',
    'Travel insurance is highly recommended and can be arranged through our agency.',
    'Valid identification documents (passport/ID) are required for all travelers.',
    'We reserve the right to modify the itinerary due to unforeseen circumstances.',
    'Any additional expenses incurred due to delays, natural disasters, or political unrest are the responsibility of the traveler.',
    'Children below 5 years are complimentary (without bed). Additional charges apply for children above 5 years.',
    'Special dietary requirements must be informed at the time of booking.',
  ];

  const displayCancellationPolicies =
    cancellationPolicies.length > 0 ? cancellationPolicies : defaultCancellationPolicies;
  const displayTermsAndConditions =
    termsAndConditions.length > 0 ? termsAndConditions : defaultTermsAndConditions;

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold text-gray-900">Booking Policy</h2>
      {/* Important Notice Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100  rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FiAlertCircle className="w-6 h-6 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-1">Important Notice</h4>
            <p className="text-sm text-orange-800">
              Please read our booking and cancellation policies carefully before confirming your
              reservation. These terms are designed to protect both parties and ensure a smooth
              travel experience.
            </p>
          </div>
        </div>
      </div>

      {/* Cancellation Policy */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r px-6 py-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FiXCircle className="w-6 h-6" />
            Cancellation Policy
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-sm">
            Cancellations are accepted based on the following time frames before the departure date:
          </p>
          <div className="space-y-4">
            {displayCancellationPolicies.map((policy, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiClock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 mb-1">{policy.type}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <p className="text-sm text-blue-800">
                <strong>Refund Processing:</strong> Approved refunds will be processed within 7-10
                business days to the original payment method.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FiCheckCircle className="w-6 h-6" />
            Terms & Conditions
          </h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6 text-sm">
            By booking with us, you agree to the following terms and conditions:
          </p>
          <div className="space-y-3">
            {displayTermsAndConditions.map((term, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-green-700">{index + 1}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed flex-1">{term}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Need Help with Your Booking?</h4>
            <p className="text-sm text-gray-600">
              Our support team is available 24/7 to assist you with any questions or concerns.
            </p>
          </div>
          <button className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};
