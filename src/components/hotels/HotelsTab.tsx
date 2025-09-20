'use client';
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, InputAdornment, Autocomplete, TextField } from '@mui/material';
import Image from 'next/image';
import { MapPin } from '@phosphor-icons/react';
import { parseDate } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/date-picker";
import { useTheme } from '@/context/ThemeContext';
import GuestsIcon from '@/assets/icons/people_3.png';
import { getCities } from '@/services/tourService';

interface CityOption {
  id: string;
  label: string;
}

interface HotelsTabProps {
  onSearchStart: () => void;
  onSearchResults: (data: any) => void;
  onSearchError: (error: string) => void;
}

const HotelsTab: React.FC<HotelsTabProps> = ({ onSearchStart, onSearchResults, onSearchError }) => {
  const theme = useTheme();
  const [location, setLocation] = useState<CityOption | null>(null);
  const [dateRange, setDateRange] = useState({
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]),
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const citiesResponse = await getCities();
        if (citiesResponse.success && citiesResponse.data) {
          const cityOptions = citiesResponse.data.map(city => ({
            id: city.id,
            label: city.label
          }));
          setCities(cityOptions);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleDateChange = (value: any) => {
    if (value) {
      setDateRange(value);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchStart();

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSearchResults({
        location: location?.label,
        dateRange,
        adults,
        children
      });
    } catch (error) {
      onSearchError('An error occurred while searching hotels');
    }
  };

  return (
    <form onSubmit={handleSearch} style={{ 
      backgroundColor: theme.colors.milkWhite,
      color: theme.colors.heavyMetal,
      borderRadius: '1rem',
      overflow: 'hidden',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div className='relative flex items-center gap-4 p-4'>
        {/* Destination */}
        <div className="flex-1 flex items-center">
          <Autocomplete
            value={location}
            onChange={(event, newValue) => {
              setLocation(newValue);
            }}
            options={cities}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={isLoading}
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
                  },
                  endAdornment: (
                    <>
                      {isLoading ? <span className="loading loading-spinner loading-sm"></span> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
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
        </div>

        {/* Date Range */}
        <div className="flex-1 flex items-center">
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
        </div>

        {/* Guests */}
        <div className="flex-1 flex items-center">
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
              value={`${adults + children}`}
              onChange={(e) => {
                const total = parseInt(e.target.value);
                if (total > 0) {
                  setAdults(Math.min(total, 2));
                  setChildren(Math.max(0, total - 2));
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <Image src={GuestsIcon} alt="Guests" width={24} height={24} />
                </InputAdornment>
              }
              style={{
                fontFamily: theme.typography.fontFamily.regular,
                fontWeight: theme.typography.fontWeight.regular,
                fontSize: theme.typography.fontSize.body,
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Search Button */}
        <Button 
          type="submit" 
          sx={{
            backgroundColor: theme.colors.carrotOrange,
            color: theme.colors.milkWhite,
            fontFamily: theme.typography.fontFamily.bold,
            fontWeight: theme.typography.fontWeight.bold,
            fontSize: theme.typography.fontSize.button,
            padding: '1rem 2rem',
            borderRadius: '0.5rem',
            margin: '0 0.5rem',
            '&:hover': {
              backgroundColor: `${theme.colors.carrotOrange}90`,
            }
          }}
        >
          SEARCH
        </Button>
      </div>
    </form>
  );
};

export default HotelsTab;