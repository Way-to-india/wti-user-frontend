import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  tourSpecificFAQs?: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ tourSpecificFAQs = [] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const generalFAQs: FAQ[] = [
    {
      question: 'What are the payment terms?',
      answer:
        'We accept various payment methods including credit cards, debit cards, and online banking. A deposit of 25% is required at the time of booking, with the balance due 30 days before departure.',
    },
    {
      question: 'What is the cancellation policy?',
      answer:
        'Cancellations made 30+ days before departure: 75% refund. 15-29 days: 50% refund. 7-14 days: 25% refund. Less than 7 days: No refund. Processing fees apply to all cancellations.',
    },
    {
      question: 'Are flights included in the package?',
      answer:
        'Flight tickets are not included in the package price unless specifically mentioned. We can assist you in booking flights at competitive rates upon request.',
    },
    {
      question: 'What documents do I need for the tour?',
      answer:
        'You will need a valid government-issued ID (Aadhar Card/Passport/Driving License). For international tours, a valid passport with at least 6 months validity and necessary visas are required.',
    },
    {
      question: 'Can I customize the itinerary?',
      answer:
        'Yes, we offer customization options for most of our tours. Please contact us with your requirements, and our team will work with you to create a personalized itinerary.',
    },
    {
      question: 'What is included in the tour package?',
      answer:
        'Typically includes accommodation, meals as specified, transportation, sightseeing, and guide services. Please check the specific tour inclusions for detailed information.',
    },
    {
      question: 'Is travel insurance included?',
      answer:
        'Travel insurance is not automatically included but is highly recommended. We can help you arrange comprehensive travel insurance for your trip.',
    },
    {
      question: 'What if I have special dietary requirements?',
      answer:
        'Please inform us of any dietary restrictions or preferences at the time of booking. We will do our best to accommodate your needs throughout the tour.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const hasTourSpecificFAQs = tourSpecificFAQs && tourSpecificFAQs.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-sm mt-6">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

        {/* Tour-Specific FAQs Section */}
        {hasTourSpecificFAQs && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
              Tour Specific FAQs
            </h3>
            <div className="space-y-3">
              {tourSpecificFAQs.map((faq, index) => (
                <div
                  key={`tour-${index}`}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General FAQs Section */}
        <div>
          <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
            General FAQs
          </h3>
          <div className="space-y-3">
            {generalFAQs.map((faq, index) => {
              const faqIndex = hasTourSpecificFAQs ? index + tourSpecificFAQs.length : index;
              return (
                <div
                  key={`general-${index}`}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(faqIndex)}
                    className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                    {openIndex === faqIndex ? (
                      <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openIndex === faqIndex && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
