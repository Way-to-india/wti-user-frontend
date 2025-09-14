// components/HotelTabs.tsx
import { Button, IconButton } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import React, { useState } from 'react';

const WindowTabs = () => {

    const [startIndex, setStartIndex] = useState(0);  // Start of the visible range
    const itemsPerPage = 4;
    //Sample data
    const [hotels, setHotels] = useState([
        { name: 'Sherpa Hotel', isActive: true },
        { name: 'Hotel Lotus Pearl', isActive: false },
        { name: 'Grand Plaza Hotel', isActive: false },
        { name: 'Marriott', isActive: false },
        { name: 'Holiday Inn', isActive: false },
        { name: 'Hilton Hotel', isActive: false },
    ]);

    // Calculate the end index
    const endIndex = startIndex + itemsPerPage;

    // Get the hotels to display on the current page
    const visibleHotels = hotels.slice(startIndex, endIndex);

    // Handler for tab clicks
    const handleTabClick = (index: number) => {
        setHotels((prevHotels) =>
            prevHotels.map((hotel, i) =>
                i === index ? { ...hotel, isActive: true } : { ...hotel, isActive: false }
            )
        );
    };

    // Handler for showing the previous set of hotels
    const handlePrevClick = () => {
        if (startIndex > 0) {
            setStartIndex((prev) => prev - itemsPerPage);
        }
    };
    // Handler for showing the next set of hotels
    const handleNextClick = () => {
        if (endIndex < hotels.length) {
            setStartIndex((prev) => prev + itemsPerPage);
        }
    };

    return (
        <div className="flex items-center justify-between my-4">
            <IconButton
                size="small"
                color="primary"
                onClick={handlePrevClick}
                className=" text-carrot-orange hover:scale-110 transition-transform duration-300"
                edge="start"
                aria-label="previous"
                style={{
                    border: '2px solid #FFA500',
                    borderRadius: '50%',
                    padding: '4px',
                    opacity: startIndex === 0 ? 0.5 : 1,
                    color: startIndex === 0 ? '#FFA500' : '',
                    pointerEvents: startIndex === 0 ? 'none' : 'auto'
                }}
                disabled={startIndex === 0} //disable on first index
            >
                <ArrowLeft size={24} />
            </IconButton>

            {/* Hotel Buttons */}
            <div className="flex overflow-x-auto">
                {visibleHotels.map((hotel, index) => (
                    <Button
                        key={index}
                        variant={hotel.isActive ? 'contained' : 'text'}
                        className={`m-1  my-2 font-bold ${hotel.isActive ? 'bg-carrot-orange' : ''}`}
                        style={{
                            color: hotel.isActive ? 'white' : '#FFA500',
                            borderRadius: '12px',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                        }}
                        onClick={() => handleTabClick(startIndex + index)}
                    >
                        {hotel.name}
                    </Button>
                ))}
            </div>

            <IconButton
                size="small"
                color="primary"
                onClick={handleNextClick}
                className="text-carrot-orange hover:scale-110 transition-transform duration-300"
                edge="start"
                aria-label="forward"
                style={{
                    border: '2px solid #FFA500',  // Orange border
                    borderRadius: '50%',           // Circular shape
                    padding: '4px',
                    opacity: endIndex >= hotels.length ? 0.5 : 1,
                    pointerEvents: endIndex >= hotels.length ? 'none' : 'auto'
                }}
                disabled={endIndex >= hotels.length}
            >
                <ArrowRight size={24} />
            </IconButton>
        </div>
    );
};

export default WindowTabs;
