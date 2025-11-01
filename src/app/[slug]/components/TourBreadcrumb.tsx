'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';

interface TourBreadcrumbProps {
  tourTitle: string;
}

const TourBreadcrumb: React.FC<TourBreadcrumbProps> = ({ tourTitle }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();

    startTransition(() => {
      router.back();
    });
  };

  return (
    <div className="bg-white py-2 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs sm:text-sm">
          <Link href="/" className="text-gray-600 hover:text-orange-500">
            Home
          </Link>
          <span className="text-gray-400">→</span>
          <button
            onClick={handleBackClick}
            className="text-gray-600 hover:text-orange-500 cursor-pointer bg-transparent border-none p-0 font-inherit disabled:opacity-50"
            disabled={isPending}
            aria-label="Go back to tours"
          >
            Tours
          </button>
          <span className="text-gray-400">→</span>
          <span className="text-orange-500 truncate">{tourTitle}</span>
        </nav>
      </div>
    </div>
  );
};

export default TourBreadcrumb;