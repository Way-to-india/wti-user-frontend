'use client';
import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import { parseDate } from '@internationalized/date';
import { DateRangePicker } from '@nextui-org/date-picker';
import { getCities } from '@/services/tourService';
import { useTheme } from '@/context/ThemeContext';

interface CityOption {
  id: string;
  label: string;
}

interface ToursTabProps {
  onSearchResults?: (data: any) => void;
  onSearchStart?: () => void;
  onSearchError?: (error: string) => void;
  onSearch?: (
    page: number,
    themeId?: string | null,
    cityId?: string | null,
    durationDays?: number
  ) => void;
  selectedCity?: string | null;
  selectedTheme?: string | null;
  typesOptions?: { id: string; label: string }[];
  typeLabel?: string;
}

const ToursTab: React.FC<ToursTabProps> = ({
  onSearchStart,
  onSearchError,
  onSearch,
  selectedCity,
  selectedTheme,
  typesOptions = [],
  typeLabel = 'Tour Theme',
}) => {
  const theme = useTheme();
  const [location, setLocation] = useState<CityOption | null>(null);
  const [dateRange, setValue] = useState({
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(
      new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
    ),
  });
  const [durationDays, setDurationDays] = useState<number>(0);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [selectedThemeValue, setSelectedThemeValue] = useState<string>(selectedTheme || '');
  const [guests, setGuests] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesResponse = await getCities();
        if (citiesResponse.success && citiesResponse.data) {
          const cityOptions = citiesResponse.data.map((city: any) => ({
            id: city.id,
            label: city.label,
          }));
          setCities(cityOptions);
          if (selectedCity) {
            const city = cityOptions.find(c => c.id === selectedCity);
            if (city) setLocation(city);
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchData();
  }, [selectedCity]);

  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDateChange = (value: any) => {
    if (value) {
      setValue(value);
      const startDate = new Date(value.start.toString());
      const endDate = new Date(value.end.toString());
      const days = calculateDuration(startDate, endDate);
      setDurationDays(days);
    }
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearchStart?.();
    try {
      await onSearch?.(
        1,
        selectedThemeValue || null,
        location?.id || null,
        durationDays > 0 ? durationDays : undefined
      );
    } catch (error) {
      onSearchError?.('An error occurred while searching tours');
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        backgroundColor: theme.colors.milkWhite,
        color: theme.colors.heavyMetal,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-4">
        <div className="w-full lg:flex-1">
          <Autocomplete
            value={location}
            onChange={(event, newValue) => setLocation(newValue)}
            options={cities}
            getOptionLabel={option => option.label}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={params => <TextField {...params} label="Select Destination" fullWidth />}
            fullWidth
          />
        </div>

        <div className="w-full lg:flex-1">
          <DateRangePicker label="Travel Dates" value={dateRange} onChange={handleDateChange} />
        </div>

        <div className="w-full lg:flex-1">
          <FormControl fullWidth>
            <InputLabel id="theme-label">{typeLabel}</InputLabel>
            <Select
              labelId="theme-label"
              value={selectedThemeValue}
              onChange={e => setSelectedThemeValue(e.target.value)}
            >
              {typesOptions.length > 0 ? (
                typesOptions.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No themes available</MenuItem>
              )}
            </Select>
          </FormControl>
        </div>

        <div className="w-full lg:flex-1">
          <FormControl fullWidth>
            <InputLabel id="guests-label">Guests</InputLabel>
            <Select
              labelId="guests-label"
              value={guests}
              onChange={e => setGuests(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Button
          type="submit"
          style={{ backgroundColor: theme.colors.carrotOrange, color: 'white', fontWeight: 'bold' }}
        >
          SEARCH
        </Button>
      </div>
    </form>
  );
};

export default ToursTab;
