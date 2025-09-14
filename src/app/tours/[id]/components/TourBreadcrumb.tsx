import Link from 'next/link';
import React from 'react';

interface TourBreadcrumbProps {
  tourTitle: string;
}

const TourBreadcrumb: React.FC<TourBreadcrumbProps> = ({ tourTitle }) => {
  return (
    <div className="bg-white py-2 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-orange-500">
            Home
          </Link>
          <span className="text-gray-400">--&gt;</span>
          <Link href="/tours" className="text-gray-600 hover:text-orange-500">
            Tours
          </Link>
          <span className="text-gray-400">--&gt;</span>
          <span className="text-orange-500">{tourTitle}</span>
        </nav>
      </div>
    </div>
  );
};

export default TourBreadcrumb;
