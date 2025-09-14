// components/HotelDetails.tsx
import React from 'react';
import RoomCard from './RoomCard';

const HotelDetails = () => {
    // TO DO: Get hotel details here
    const rooms = [
        {
            title: 'Standard Room',
            capacity: '2-3 Guests',
            size: '150 sq.ft',
            description: "Sherpa Hotel's standard rooms in Rishikesh offer a comfortable and cozy retreat. Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
            amenities: [
                'Comfortable bedding and linens',
                'Private Bathroom',
                'Hot Water',
                'Television',
                'Wifi-access',
                'Desk',
                'Wardrobe',
            ],
            price: 2500,
        },
        {
            title: 'Standard Room with Balcony',
            capacity: '2-3 Guests',
            size: '175 sq.ft',
            description: "Sherpa Hotel's standard rooms in Rishikesh offer a comfortable and cozy retreat. Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
            amenities: [
                'Comfortable bedding and linens',
                'Private Bathroom',
                'Hot Water',
                'Television',
                'Wifi-access',
                'Desk',
                'Wardrobe',
            ],
            price: 3500,
        },
    ];

    return (
        <div>
            {rooms.map((room, index) => (
                <RoomCard key={index} {...room} />
            ))}
        </div>
    );
}

export default HotelDetails;
