// components/RoomCard.tsx
import React, { useState } from 'react';
import { Box, Button, FormControl, InputAdornment, MenuItem, Select } from '@mui/material';
import Image from 'next/image';
import hotelImg from '@/assets/images/hotel.png';
import { User } from '@phosphor-icons/react';

interface RoomCardProps {
    title: string;
    capacity: string;
    size: string;
    description: string;
    amenities: string[];
    price: number;
}

const RoomCard: React.FC<RoomCardProps> = ({ title, capacity, size, description, amenities, price }) => {
    const [selectedGuests, setSelectedGuests] = useState<number>(2); // Default to 2 guests
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const handleSelectRoom = () => {
        setIsSelected((prevState) => !prevState);  // Toggle Button state
    };

    return (
        <div className="border border-gray-300 rounded-lg my-6">
            <div className='flex flex-row p-4'>
                <div className='w-1/3 relative mr-4'>
                    <Image src={hotelImg} alt={'Hotel'} layout='fill' objectFit='cover' className='rounded-lg' />
                </div>
                <div className='w-2/3'>
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className='flex gap-2 my-4'>
                        <span className='flex items-center border-2 rounded-lg p-1 border-heavy-metal'>
                            <User fontSize="medium" />
                            <span className="ml-1">{capacity}</span>
                        </span>
                        <span className='flex items-center border-2 rounded-lg p-1 border-heavy-metal'>
                            <User fontSize="medium" />
                            <span className="ml-1">{size}</span>
                        </span>
                    </div>
                    <p className="mt-4">{description}</p>
                    <h4 className="font-semibold mt-4">AMENITIES</h4>
                    <div className="flex flex-wrap text-md mt-1 border-2 p-2 rounded-lg">
                        {amenities.map((amenity, index) => (
                            <React.Fragment key={index}>
                                <span>{amenity}</span>
                                {index < amenities.length - 1 && <span className="mx-1">•</span>} {/* Dot separator */}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Line divider */}
            <hr className="border-t-2 border-gray-300" />

            {/* Price and selection section */}
            <div className="flex justify-between items-center m-4">
                <div>
                    <p className="text-sm text-gray-500"> Price per room for 1 night (excluding tax)</p>
                    <h3 className="text-xl font-bold mt-1">₹{price}</h3>
                </div>
                <div>
                    {/* Dropdown for selecting number of guests */}
                    <FormControl variant="outlined" size="small" className="mr-2">
                        <Select
                            value={selectedGuests}
                            onChange={(e) => setSelectedGuests(Number(e.target.value))}
                            startAdornment={
                                <InputAdornment position="start">
                                    <User fontSize="large" style={{ color: '#FF8B02' }} />
                                </InputAdornment>
                            }
                        >
                            {[1, 2, 3, 4].map((num) => (
                                <MenuItem key={num} value={num}>
                                    {num}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Select Room Button */}
                    <Button
                        variant="contained"
                        onClick={handleSelectRoom}
                        className='rounded-lg font-bold py-2'
                        sx={{
                            bgcolor: isSelected ? '#DDFFD7' : '#FF8B02', // Lighter green fill when selected
                            color: isSelected ? '#31A31C' : 'white', // Green text when selected
                        }}
                    >
                        {isSelected ? "Selected" : "Select room"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RoomCard;
