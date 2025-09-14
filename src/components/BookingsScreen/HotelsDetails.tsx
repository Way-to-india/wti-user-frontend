"use client"
import { TextField, InputAdornment, FormControl, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import DetailsCard from './DetailsCard/DetailsCard'
import { StaticImageData } from 'next/image';
import placeholderImage from "@/assets/images/destination.png"

interface hotelDetailsProp {
    image: StaticImageData,
    hotelName: string,
    star: string,
    dest: string,
    rating: string,
    roomNumber: string,
    description: string,
    price: number
}

const hotelList = [
    {
        image: placeholderImage,
        hotelName: "Sherpa Hotel",
        star: "4",
        dest: "Rishikesh",
        rating: "4.5",
        roomNumber: "2",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos dicta perferendis laudantium.",
        price: 2500
    },
    {
        image: placeholderImage,
        hotelName: "Everest Inn",
        star: "5",
        dest: "Manali",
        rating: "4.7",
        roomNumber: "3",
        description: "Experience the breathtaking beauty of the Himalayas with luxurious accommodations and top-notch services.",
        price: 3200
    },
    {
        image: placeholderImage,
        hotelName: "Mountain View Resort",
        star: "3",
        dest: "Shimla",
        rating: "4.2",
        roomNumber: "4",
        description: "A peaceful getaway nestled in the hills, offering scenic views and cozy rooms.",
        price: 1800
    },
    {
        image: placeholderImage,
        hotelName: "Riverfront Lodge",
        star: "4",
        dest: "Haridwar",
        rating: "4.6",
        roomNumber: "5",
        description: "Enjoy the serenity of riverside living in a luxurious environment, perfect for a quiet retreat.",
        price: 2800
    },
    {
        image: placeholderImage,
        hotelName: "Riverfront Lodge",
        star: "4",
        dest: "Haridwar",
        rating: "4.6",
        roomNumber: "5",
        description: "Enjoy the serenity of riverside living in a luxurious environment, perfect for a quiet retreat.",
        price: 2800
    }
];


const HotelDetails: React.FC<{ prop: hotelDetailsProp }> = ({ prop }) => {

    const [sortBy, setSortBy] = useState('Relevant')

    return (
        <>

            <h2 className="text-2xl font-semibold text-gray-800 mt-10">Hotel Details</h2>
            <div className="inline-block">
                <h3 className="text-sm mt-4 font-semibold text-gray-800">IN {prop.dest.toUpperCase()}</h3>
                <div className="border-t-2 border-carrot-orange mt-1"></div>
            </div>
            <div className='flex justify-start space-x-4 my-4'>
                <TextField
                    variant="outlined"
                    placeholder="Search"
                    className='w-64'
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl>
                    <Select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        renderValue={(selected) => (
                            <p className='text-gray-400'>Sort by: <span className='text-carrot-orange'>{selected}</span></p>
                        )}
                        className=""
                    >
                        <MenuItem value="Name">Name</MenuItem>
                        <MenuItem value="Relevant">Relevant</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <div className='flex justify-start space-x-4 overflow-x-auto'>
                {hotelList.map((hotel, index) => (
                    <DetailsCard key={index} placeHolder={hotel} />
                ))}
            </div>


        </>
    )

}

export default HotelDetails