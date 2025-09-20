'use client';
import NavBar from '@/components/layout/navbar/NavBar';

interface SkeletonItemProps {
  className?: string;
}

const SkeletonItem: React.FC<SkeletonItemProps> = ({ className = '' }) => (
  <div className={`bg-gray-200 animate-pulse rounded-lg ${className}`} />
);

const LandingSkeleton: React.FC = () => {

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <NavBar />

      {/* Hero section skeleton */}
      <SkeletonItem className="w-full h-[600px] mb-12" />

      {/* Search section skeleton */}
      <div className="container mx-auto px-4 -mt-20 z-10 relative mb-16">
        <SkeletonItem className="h-[100px] bg-white shadow-lg" />
      </div>

      {/* Featured tours skeleton */}
      <SectionSkeleton
        title="Featured Tours"
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        items={3}
        itemHeight="h-[320px]"
      />

      {/* Popular destinations skeleton */}
      <SectionSkeleton
        title="Popular Destinations"
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        items={4}
        itemHeight="h-[300px]"
      />

      {/* Services section skeleton */}
      <div className="bg-gray-50 py-16 mb-20">
        <div className="container mx-auto px-4">
          <SkeletonItem className="h-8 w-48 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }, (_, index) => (
              <SkeletonItem key={index} className="h-[150px] bg-white" />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials skeleton */}
      <SectionSkeleton
        title="Testimonials"
        titleWidth="w-60"
        gridCols="grid-cols-1 md:grid-cols-3"
        items={3}
        itemHeight="h-[200px]"
        centered
      />

      {/* CTA Section skeleton */}
      <SkeletonItem className="w-full h-[250px] mb-20 bg-carrot-orange/30" />
    </div>
  );
};

interface SectionSkeletonProps {
  title?: string;
  titleWidth?: string;
  gridCols: string;
  items: number;
  itemHeight: string;
  centered?: boolean;
}

const SectionSkeleton: React.FC<SectionSkeletonProps> = ({
  title,
  titleWidth = 'w-48',
  gridCols,
  items,
  itemHeight,
  centered = false
}) => (
  <div className="container mx-auto px-4 mb-20">
    <div className={`flex ${centered ? 'justify-center' : 'justify-between'} items-center mb-8`}>
      <SkeletonItem className={`h-8 ${titleWidth}`} />
      {!centered && <SkeletonItem className="h-6 w-32" />}
    </div>
    <div className={`grid ${gridCols} gap-6`}>
      {Array.from({ length: items }, (_, index) => (
        <SkeletonItem key={index} className={itemHeight} />
      ))}
    </div>
  </div>
);

export default LandingSkeleton;
