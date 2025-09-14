'use client'
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, InputAdornment, TextField, Autocomplete } from '@mui/material';
import GuestsIcon from "@/assets/icons/people_3.png"
import Image from 'next/image';
import { MapPin } from '@phosphor-icons/react';
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/date-picker";
import { getCitiesForTransport } from '@/services/transportService';

// Define the city interface
interface CityOption {
  id: string;
  label: string;
}

const TransportationTab = () => {
    // State for search inputs
    const [transportType, setTransportType] = useState('');
    const [startLocation, setStartLocation] = useState<CityOption | null>(null);
    const [dateRange, setValue] = useState({
        start: parseDate(new Date().toISOString().split('T')[0]), // Set to current date
        end: parseDate(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]), // Set to 7 days from the current date
    });
    const [adults, setAdults] = useState(1);
    const [seniorAdults, setSeniorAdults] = useState(1);
    const [children, setChildren] = useState(0);
    // New state for cities
    const [cities, setCities] = useState<CityOption[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch cities from the API on component mount
    useEffect(() => {
        const fetchCities = async () => {
            setLoading(true);
            try {
                const citiesData = await getCitiesForTransport();
                setCities(citiesData);
            } catch (error) {
                console.error('Error fetching cities:', error);
                // If API fails, provide a fallback
                setCities([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCities();
    }, []);

    const guestTypes = [
        { label: 'Adults', value: adults, setValue: setAdults, minValue: 1 },
        { label: 'Senior Adults', value: seniorAdults, setValue: setSeniorAdults, minValue: 0 },
        { label: 'Children', value: children, setValue: setChildren, minValue: 0 }
    ];

    const handleSearch = (e: any) => {
        // Implement search logic based on inputs
        e.preventDefault();
        const searchParams = {
            transportType,
            startLocation,
            dateRange,
            adults,
            seniorAdults,
            children
        };
        console.log(searchParams);
        // Add your search logic here (e.g., API call)
    };

    return (
        <form onSubmit={handleSearch} className="bg-milk-white text-heavy-metal rounded-2xl overflow-hidden" >
            <div className='relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-4'>
                {/* Start Location */}
                <div className="w-full lg:flex-1 mb-4 lg:mb-0">
                    <Autocomplete
                        value={startLocation}
                        onChange={(_, newValue) => setStartLocation(newValue)}
                        options={loading ? [] : cities}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={loading ? "Loading cities..." : "Start Location"}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MapPin className="text-2xl text-gray-500" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        )}
                        fullWidth
                    />
                </div>
                {/* Date Range */}
                <div className="w-full lg:flex-1 mb-4 lg:mb-0">
                    <DateRangePicker
                        label="From - To"
                        value={dateRange}
                        onChange={(val) => {
                            if (val && 'start' in val && 'end' in val) {
                                setValue({ start: val.start, end: val.end });
                            }
                        }}
                        radius='sm'
                        variant='bordered'
                        className='text-carrot-orange '
                    />
                </div>
                {/* Number of Guests*/}
                <div className="w-full lg:flex-1 mb-4 lg:mb-0">
                    <FormControl fullWidth>
                        <InputLabel id="guests-label">Guests</InputLabel>
                        <Select
                            labelId="guests-label"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Image src={GuestsIcon} alt="Guests" width={42} />
                                </InputAdornment>
                            }
                        >
                            {guestTypes.map(({ label, value, setValue, minValue }) => (
                                <MenuItem key={label} className="flex justify-between">
                                    <div>{label}:</div>
                                    <div className="flex flex-row justify-end items-center">
                                        <Button
                                            onClick={() => setValue(value - 1)}
                                            disabled={value <= minValue}
                                            className="w-8 h-8 border border-gray-400 rounded-md flex items-center justify-center bg-carrot-orange text-xl text-heavy-metal">
                                            -
                                        </Button>
                                        <span className="px-2">{value}</span>
                                        <Button
                                            onClick={() => setValue(value + 1)}
                                            className="w-8 h-8 border border-gray-400 rounded-md flex items-center justify-center bg-carrot-orange text-xl text-heavy-metal ">
                                            +
                                        </Button>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <Button type="submit" className="w-full lg:w-auto bg-carrot-orange rounded-lg text-white px-6 py-3 lg:px-8 lg:py-4 font-bold hover:bg-orange-600 transition duration-300">
                    SEARCH
                </Button>
            </div>
        </form>
    );
};

export default TransportationTab;