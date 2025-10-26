'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  order?: number;
}

interface TourFAQProps {
  faqs: FAQItem[];
  tourTitle?: string;
}

const TourFAQ: React.FC<TourFAQProps> = ({ faqs, tourTitle }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No FAQs Available
        </h3>
        <p className="text-gray-500">
          Frequently asked questions for this tour will be added soon.
        </p>
      </div>
    );
  }


  const sortedFaqs = [...faqs].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });


  const handleWhatsAppClick = () => {
    const phoneNumber = '+918527255995';
    const message = encodeURIComponent('Hi! I would like to inquire about your tour packages.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-lg">
            <HelpCircle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            {tourTitle && (
              <p className="text-sm text-gray-600 mt-1">
                Everything you need to know about {tourTitle}
              </p>
            )}
          </div>
        </div>
      </div>


      <div className="divide-y divide-gray-200">
        {sortedFaqs.map((faq, index) => (
          <div
            key={index}
            className="transition-all duration-200 hover:bg-gray-50"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
              </div>
              <div className="flex-shrink-0 mt-1">
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>


            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index
                ? 'max-h-[1000px] opacity-100'
                : 'max-h-0 opacity-0'
                }`}
            >
              <div className="px-6 pb-5">
                <div className="pt-2 pl-0">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-3">
            Still have questions? We're here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <div
              className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Us
            </div>
            <div
              onClick={handleWhatsAppClick}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              WhatsApp
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourFAQ;