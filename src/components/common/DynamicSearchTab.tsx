'use client';
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  InputAdornment,
  Autocomplete,
  TextField,
  Box
} from '@mui/material';
import Image from 'next/image';
import { parseDate } from "@internationalized/date";
import { DateRangePicker } from "@nextui-org/date-picker";
import { useTheme } from '@/context/ThemeContext';

// Import common icons or use Material UI icons as fallbacks
import GuestsIcon from "@/assets/icons/people_3.png";

export interface LocationOption {
  id: string;
  label: string;
}

export interface DateRange {
  start: any;
  end: any;
}

export interface SearchTabProps {
  type: 'tour' | 'hotel' | 'transport';
  
  // Locations
  locations?: LocationOption[];
  selectedLocation?: LocationOption | null;
  selectedFromLocation?: LocationOption | null;
  selectedToLocation?: LocationOption | null;
  
  // Date range
  initialDateRange?: DateRange;
  dateRangeLabel?: string;

  // Type selection specific to type (e.g., hotel types, transport types)
  typesOptions?: { id: string; label: string }[];
  selectedType?: string;
  typeLabel?: string;
  
  // Callback handlers
  onSearch: (searchParams: any) => void;
  onLocationChange?: (location: LocationOption | null) => void;
  onFromLocationChange?: (location: LocationOption | null) => void;
  onToLocationChange?: (location: LocationOption | null) => void;
  onTypeChange?: (type: string) => void;
  onDateChange?: (dateRange: DateRange) => void;
}

const DynamicSearchTab: React.FC<SearchTabProps> = ({
  type,
  locations = [],
  selectedLocation = null,
  selectedFromLocation = null,
  selectedToLocation = null,
  initialDateRange,
  dateRangeLabel,
  typesOptions = [],
  selectedType = '',
  typeLabel = '',
  onSearch,
  onLocationChange,
  onFromLocationChange,
  onToLocationChange,
  onTypeChange,
  onDateChange
}) => {
  const theme = useTheme();

  // Guest counts state
  const [adults, setAdults] = useState(1);
  const [seniorAdults, setSeniorAdults] = useState(0);
  const [children, setChildren] = useState(0);
  
  // Local location states
  const [location, setLocation] = useState<LocationOption | null>(selectedLocation);
  const [fromLocation, setFromLocation] = useState<LocationOption | null>(selectedFromLocation);
  const [toLocation, setToLocation] = useState<LocationOption | null>(selectedToLocation);
  const [typeValue, setTypeValue] = useState<string>(selectedType);
  
  // Date range state
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange || {
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]),
  });

  // Update local state when props change
  useEffect(() => {
    if (selectedLocation !== null && selectedLocation !== undefined) {
      setLocation(selectedLocation);
    }
    if (selectedFromLocation !== null && selectedFromLocation !== undefined) {
      setFromLocation(selectedFromLocation);
    }
    if (selectedToLocation !== null && selectedToLocation !== undefined) {
      setToLocation(selectedToLocation);
    }
    if (selectedType !== null && selectedType !== undefined) {
      setTypeValue(selectedType);
    }
  }, [selectedLocation, selectedFromLocation, selectedToLocation, selectedType]);

  // Guest types definition
  const guestTypes = [
    { label: 'Adults', value: adults, setValue: setAdults, minValue: 1 },
    { label: 'Senior Adults', value: seniorAdults, setValue: setSeniorAdults, minValue: 0 },
    { label: 'Children', value: children, setValue: setChildren, minValue: 0 }
  ];

  // Calculate duration between two dates
  const calculateDuration = (start: Date, end: Date) => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Handle date range change
  const handleDateChange = (value: any) => {
    if (value) {
      setDateRange(value);
      
      const startDate = new Date(value.start.toString());
      const endDate = new Date(value.end.toString());
      const days = calculateDuration(startDate, endDate);
      
      if (onDateChange) {
        onDateChange(value);
      }
    }
  };

  // Handle location changes
  const handleLocationChange = (newLocation: LocationOption | null) => {
    setLocation(newLocation);
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
  };

  const handleFromLocationChange = (newLocation: LocationOption | null) => {
    setFromLocation(newLocation);
    if (onFromLocationChange) {
      onFromLocationChange(newLocation);
    }
  };

  const handleToLocationChange = (newLocation: LocationOption | null) => {
    setToLocation(newLocation);
    if (onToLocationChange) {
      onToLocationChange(newLocation);
    }
  };

  // Handle type changes
  const handleTypeChange = (event: any) => {
    const newType = event.target.value;
    setTypeValue(newType);
    if (onTypeChange) {
      onTypeChange(newType);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams: any = {
      type,
      dateRange,
      adults,
      seniorAdults,
      children
    };
    if (type === 'tour' || type === 'hotel') {
      searchParams.location = location;
      if (typeValue) {
        searchParams.selectedType = typeValue;
      }
    } else if (type === 'transport') {
      searchParams.location = location;
    }
    onSearch(searchParams);
  };

  return (
    <form 
      onSubmit={handleSearchSubmit}
      style={{ 
        backgroundColor: theme.colors.milkWhite,
        color: theme.colors.heavyMetal,
        borderRadius: '1rem',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2
      }}>
        {/* Location field for all types */}
        <Box sx={{ flex: 1 }}>
          <Autocomplete
            value={location}
            onChange={(_, newValue) => handleLocationChange(newValue)}
            options={locations}
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
                label={type === 'transport' ? 'Start Location' : 'Select Destination'}
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
        </Box>

        {/* Date Range */}
        <Box sx={{ flex: 1 }}>
          <DateRangePicker
            label={dateRangeLabel || (type === 'hotel' ? "Check in - Check Out" : "From - To")}
            value={dateRange}
            onChange={handleDateChange}
            radius="sm"
            variant="bordered"
            style={{
              color: theme.colors.carrotOrange,
              fontFamily: theme.typography.fontFamily.regular,
              fontWeight: theme.typography.fontWeight.regular,
              fontSize: theme.typography.fontSize.body,
            }}
            startContent={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.colors.heavyMetal }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            }
          />
        </Box>

        {/* Type selection if applicable */}
        {typesOptions.length > 0 && (
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="type-label" sx={{
                fontFamily: theme.typography.fontFamily.regular,
                fontWeight: theme.typography.fontWeight.regular,
                fontSize: theme.typography.fontSize.label,
              }}>
                {typeLabel || (type === 'hotel' ? 'Hotel Type' : 'Type')}
              </InputLabel>
              <Select
                labelId="type-label"
                value={typeValue}
                onChange={handleTypeChange}
                sx={{
                  fontFamily: theme.typography.fontFamily.regular,
                  fontWeight: theme.typography.fontWeight.regular,
                  fontSize: theme.typography.fontSize.body,
                }}
              >
                {typesOptions.map((option) => (
                  <MenuItem 
                    key={option.id} 
                    value={option.id}
                    sx={{
                      fontFamily: theme.typography.fontFamily.regular,
                      fontWeight: theme.typography.fontWeight.regular,
                      fontSize: theme.typography.fontSize.body,
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Guests Selection */}
        <Box sx={{ flex: 1 }}>
          <FormControl fullWidth>
            <InputLabel id="guests-label" sx={{
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
              sx={{
                fontFamily: theme.typography.fontFamily.regular,
                fontWeight: theme.typography.fontWeight.regular,
                fontSize: theme.typography.fontSize.body,
              }}
            >
              {guestTypes.map(({ label, value, setValue, minValue }) => (
                <MenuItem key={label} sx={{
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontFamily: theme.typography.fontFamily.regular,
                  fontWeight: theme.typography.fontWeight.regular,
                  fontSize: theme.typography.fontSize.body,
                }}>
                  <div>{label}:</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                      onClick={() => setValue(value - 1)}
                      disabled={value <= minValue}
                      sx={{
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
                        minWidth: 'auto',
                        '&.Mui-disabled': {
                          backgroundColor: '#F3F4F6',
                        }
                      }}
                    >
                      -
                    </Button>
                    <span style={{ padding: '0 0.5rem' }}>{value}</span>
                    <Button
                      onClick={() => setValue(value + 1)}
                      sx={{
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
                        minWidth: 'auto',
                      }}
                    >
                      +
                    </Button>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
      </Box>
    </form>
  );
};

export default DynamicSearchTab;