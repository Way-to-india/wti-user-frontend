// components/details/hotelData.dto.ts

type RoomType = {
    roomType: string;
    roomSize?: string;
    roomCapacity?: string;
    description: string;
    amenities: string[];
    pricePerNight: number;
};

export type HotelDetailsType = {
    name: string;
    location: string;
    description: string;
    amenities: string[];
    roomTypes: RoomType[];
};

export const hotels: HotelDetailsType[] = [
    {
        name: 'Sherpa Hotel',
        location: 'Govindghat',
        description: 'A cozy hotel with beautiful mountain views.',
        amenities: ['Free Wi-Fi', 'Parking', 'Swimming Pool'],
        roomTypes: [
            {
                roomType: "Standard Room with Balcony",
                roomSize: "20 sq. meters",
                roomCapacity: "2 ~ 3 Guests",
                description: "Enjoy a peaceful night's sleep in a well-appointed space featuring modern amenities.",
                amenities: ['Free Wi-Fi', 'Breakfast included', 'Parking', 'Swimming Pool'],
                pricePerNight: 120,
            },
            {
                roomType: "Deluxe Room with Mountain View",
                roomSize: "25 sq. meters",
                roomCapacity: "3 Guests",
                description: "Spacious room with a stunning view of the mountains.",
                amenities: ['Free Wi-Fi', 'Mountain View', 'Heated Rooms'],
                pricePerNight: 150,
            }
        ],
    },
    {
        name: 'Mountain View Hotel',
        location: 'Ghangariya',
        description: 'A cozy hotel located near trekking spots, perfect for adventure lovers.',
        amenities: ['Trekking Guides', 'Mountain View', 'Heated Rooms', 'Restaurant'],
        roomTypes: [
            {
                roomType: "Single Room",
                roomSize: "15 sq. meters",
                roomCapacity: "1 Adult",
                description: "Compact yet comfortable room for solo travelers.",
                amenities: ['Free Wi-Fi', 'Trekking Guides'],
                pricePerNight: 80,
            },
            {
                roomType: "Double Room",
                roomSize: "22 sq. meters",
                roomCapacity: "2 Adults",
                description: "Perfect room for couples or friends looking to trek.",
                amenities: ['Mountain View', 'Heated Rooms'],
                pricePerNight: 100,
            }
        ],
    }
];