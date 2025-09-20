// components/window/TransportDetails.tsx
import React from 'react';
import DynamicCard from '@/components/common/DynamicCard';
import { StaticImageData } from 'next/image';

interface TransportDetail {
  name: string;
  capacity: string;
  description: string;
  amenities: string[];
  price: number;
  imageUrl: StaticImageData;
}

interface TransportDetailsProps {
  transportData: TransportDetail[]; // Accept transport data as props
}

const TransportDetails: React.FC<TransportDetailsProps> = ({ transportData }) => {
  return (
    <div className="grid gap-4">
      {transportData.map((transport, index) => (
        <DynamicCard
          key={index}
          type="transport"
          imageUrls={[typeof transport.imageUrl === 'string' ? transport.imageUrl : transport.imageUrl.src]}
          title={transport.name}
          description={transport.description}
          price={transport.price}
          amenities={transport.amenities}
        />
      ))}
    </div>
  );
};

export default TransportDetails;
