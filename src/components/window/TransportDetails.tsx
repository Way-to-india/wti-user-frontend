// components/window/TransportDetails.tsx
import React from 'react';
import TransportCard from '@/app/components/window/TransportCard';
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
        <div>
            {transportData.map((transport, index) => (
                <TransportCard
                    title={transport.name}
                    key={index}
                    capacity={transport.capacity}
                    description={transport.description}
                    amenities={transport.amenities}
                    price={transport.price}
                    imageUrl={transport.imageUrl}
                />
            ))}
        </div>
    );
};

export default TransportDetails;
