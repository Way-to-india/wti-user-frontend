'use client'
import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, InputAdornment, Autocomplete, TextField } from '@mui/material';
import Image from 'next/image';
import TripIcon from '@/assets/icons/tripIcon.png';
import GuestsIcon from '@/assets/icons/people_3.png'
import HotelIcon from '@/assets/icons/hotel.png'
import ScheduleIcon from '@/assets/icons/schedule.png'
import { MapPin } from '@phosphor-icons/react';
import { parseDate, getLocalTimeZone } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/date-picker";
import { getCities, getTours } from '@/services/tourService';
import { getThemes } from '@/services/tourService';
import { useTheme } from '@/context/ThemeContext';

interface Tour {
    id: string;
    themes: string[]; //get the themes for search selection
}

interface CityOption {
    id: string;
    label: string;
}

interface ToursTabProps {
    onSearchResults: (data: any) => void;
    onSearchStart: () => void;
    onSearchError: (error: string) => void;
    onSearch: (page: number, themeId?: string | null, cityId?: string | null, durationDays?: number) => void;
    selectedCity: string | null;
    selectedTheme: string | null;
}

const ToursTab: React.FC<ToursTabProps> = ({ onSearchResults, onSearchStart, onSearchError, onSearch, selectedCity, selectedTheme }) => {
    const theme = useTheme();
    const [location, setLocation] = useState<CityOption | null>(null);
    const [hotelType, setHotelType] = useState('');
    const [dateRange, setValue] = useState({
        start: parseDate(new Date().toISOString().split('T')[0]),
        end: parseDate(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]),
    });
    const [durationDays, setDurationDays] = useState<number>(0);
    const [adults, setAdults] = useState(1);
    const [seniorAdults, setSeniorAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [cities, setCities] = useState<CityOption[]>([]);

    const [tours, setTours] = useState<Tour[]>([]);
    const [uniqueThemes, setUniqueThemes] = useState<string[]>([]);

    const guestTypes = [
        { label: 'Adults', value: adults, setValue: setAdults, minValue: 1 },
        { label: 'Senior Adults', value: seniorAdults, setValue: setSeniorAdults, minValue: 0 },
        { label: 'Children', value: children, setValue: setChildren, minValue: 0 }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch cities
                const citiesResponse = await getCities();
                if (citiesResponse.success && citiesResponse.data) {
                    const cityOptions = citiesResponse.data.map(city => ({
                        id: city.id,
                        label: city.label
                    }));
                    setCities(cityOptions);
                    if (selectedCity) {
                        const city = cityOptions.find(c => c.id === selectedCity);
                        if (city) setLocation(city);
                    }
                }

                // Fetch tours
                // const response = await fetch('https://cors-anywhere.herokuapp.com/https://way-to-india.onrender.com/api/user/tour-packages'); //Dev phases only remove afterwards 
                // const response = await fetch('https://way-to-india.onrender.com/api/user/tour-packages'); //Change to this api line
                // const data = await response.json();
                // setTours(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedCity]);

    useEffect(() => {
        const themes = tours.flatMap(tour => tour.themes);
        const uniqueThemesSet = new Set(themes);
        setUniqueThemes(Array.from(uniqueThemesSet));
    }, [tours]);

    const calculateDuration = (start: Date, end: Date) => {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleDateChange = (value: any) => {
        if (value) {
            setValue(value);
            const startDate = new Date(value.start.toString());
            const endDate = new Date(value.end.toString());
            const days = calculateDuration(startDate, endDate);
            setDurationDays(days);
            // Only pass duration if it's greater than 0
            onSearch(1, theme || null, location?.id || null, days > 0 ? days : undefined);
        }
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearchStart();

        try {
            await onSearch(1, theme || null, location?.id || null, durationDays > 0 ? durationDays : undefined);
        } catch (error) {
            onSearchError('An error occurred while searching tours');
        }
    };    return (
        <form onSubmit={handleSearch} style={{ 
            backgroundColor: theme.colors.milkWhite,
            color: theme.colors.heavyMetal,
            borderRadius: '1rem',
            overflow: 'hidden'
        }}>
            <div className='relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-4'>
                {/* Destination */}
                <div className="w-full lg:flex-1 mb-4 lg:mb-0">
                    <Autocomplete
                        value={location}
                        onChange={(event, newValue) => {
                            setLocation(newValue);
                            if (newValue) {
                                onSearch(1, theme || null, newValue.id, durationDays > 0 ? durationDays : undefined);
                            } else {
                                onSearch(1, theme || null, null, durationDays > 0 ? durationDays : undefined);
                            }
                        }}
                        options={cities}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        filterOptions={(options, { inputValue }) => {
                            return options.filter((option) =>
                                option.label.toLowerCase().includes(inputValue.toLowerCase())
                            ).slice(0, 5);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Destination"
                                InputProps={{
                                    ...params.InputProps,
                                    style: {
                                        fontFamily: theme.typography.fontFamily.regular,
                                        fontWeight: theme.typography.fontWeight.regular,
                                        fontSize: theme.typography.fontSize.body,
                                    }
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontFamily: theme.typography.fontFamily.regular,
                                        fontWeight: theme.typography.fontWeight.regular,
                                        fontSize: theme.typography.fontSize.label,
                                    }
                                }}
                                fullWidth
                            />
                        )}
                        fullWidth
                    />
                </div>                {/* Date Range */}
                <div className="w-full lg:flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center gap-2 w-full">
                        <DateRangePicker
                            label="From - To"
                            value={dateRange}
                            onChange={handleDateChange}
                            radius='sm'
                            variant='bordered'
                            style={{
                                color: theme.colors.carrotOrange,
                                fontFamily: theme.typography.fontFamily.regular,
                                fontWeight: theme.typography.fontWeight.regular,
                                fontSize: theme.typography.fontSize.body,
                            }}
                            className='flex-1'
                            startContent={
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.colors.heavyMetal }}>
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            }
                        />
                    </div>
                </div>                {/* Number of Guests*/}
                <div className="w-full lg:flex-1 mb-4 lg:mb-0">
                    <FormControl fullWidth>
                        <InputLabel id="guests-label" style={{
                            fontFamily: theme.typography.fontFamily.regular,
                            fontWeight: theme.typography.fontWeight.regular,
                            fontSize: theme.typography.fontSize.label,
                            backgroundColor: theme.colors.milkWhite,
                            paddingLeft: '0.5rem',
                            paddingRight: '0.5rem'
                        }}>Guests</InputLabel>
                        <Select
                            labelId="guests-label"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Image src={GuestsIcon} alt="Guests" width={42} />
                                </InputAdornment>
                            }
                            style={{
                                fontFamily: theme.typography.fontFamily.regular,
                                fontWeight: theme.typography.fontWeight.regular,
                                fontSize: theme.typography.fontSize.body,
                            }}
                        >
                            {guestTypes.map(({ label, value, setValue, minValue }) => (
                                <MenuItem key={label} className="flex justify-between" style={{
                                    fontFamily: theme.typography.fontFamily.regular,
                                    fontWeight: theme.typography.fontWeight.regular,
                                    fontSize: theme.typography.fontSize.body,
                                }}>
                                    <div>{label}:</div>
                                    <div className="flex flex-row justify-end items-center">
                                        <Button
                                            onClick={() => setValue(value - 1)}
                                            disabled={value <= minValue}
                                            style={{
                                                width: '2rem',
                                                height: '2rem',
                                                border: `1px solid ${theme.colors.heavyMetal}40`,
                                                borderRadius: '0.375rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: theme.colors.carrotOrange,
                                                color: theme.colors.heavyMetal,
                                                fontSize: theme.typography.fontSize.body,
                                                fontFamily: theme.typography.fontFamily.regular,
                                                fontWeight: theme.typography.fontWeight.regular,
                                            }}
                                        >
                                            -
                                        </Button>
                                        <span className="px-2">{value}</span>
                                        <Button
                                            onClick={() => setValue(value + 1)}
                                            style={{
                                                width: '2rem',
                                                height: '2rem',
                                                border: `1px solid ${theme.colors.heavyMetal}40`,
                                                borderRadius: '0.375rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: theme.colors.carrotOrange,
                                                color: theme.colors.heavyMetal,
                                                fontSize: theme.typography.fontSize.body,
                                                fontFamily: theme.typography.fontFamily.regular,
                                                fontWeight: theme.typography.fontWeight.regular,
                                            }}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>                <Button 
                    type="submit" 
                    style={{
                        backgroundColor: theme.colors.carrotOrange,
                        color: theme.colors.milkWhite,
                        fontFamily: theme.typography.fontFamily.bold,
                        fontWeight: theme.typography.fontWeight.bold,
                        fontSize: theme.typography.fontSize.button,
                        padding: '1rem 2rem',
                        borderRadius: '0.5rem',
                        width: '100%', // Full width on mobile
                        '&:hover': {
                            backgroundColor: `${theme.colors.carrotOrange}90`,
                        }
                    }}
                    className="lg:w-auto"
                >
                    SEARCH
                </Button>
            </div>
        </form>
    );
};

export default ToursTab;