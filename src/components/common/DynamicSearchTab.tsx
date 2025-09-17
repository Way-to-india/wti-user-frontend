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
  Box,
} from '@mui/material';
import Image from 'next/image';
import { parseDate } from '@internationalized/date';
import { DateRangePicker } from '@nextui-org/date-picker';
import { useTheme } from '@/context/ThemeContext';

// Import common icons
import GuestsIcon from '@/assets/icons/people_3.png';

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
  locations?: LocationOption[];
  selectedLocation?: LocationOption | null;
  selectedFromLocation?: LocationOption | null;
  selectedToLocation?: LocationOption | null;
  initialDateRange?: DateRange;
  dateRangeLabel?: string;
  typesOptions?: { id: string; label: string }[];
  selectedType?: string;
  typeLabel?: string;
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
  onDateChange,
}) => {
  const theme = useTheme();

  // Guest counts
  const [adults, setAdults] = useState(1);
  const [seniorAdults, setSeniorAdults] = useState(0);
  const [children, setChildren] = useState(0);

  // State for locations and types
  const [location, setLocation] = useState<LocationOption | null>(selectedLocation);
  const [fromLocation, setFromLocation] = useState<LocationOption | null>(selectedFromLocation);
  const [toLocation, setToLocation] = useState<LocationOption | null>(selectedToLocation);
  const [typeValue, setTypeValue] = useState<string>(selectedType);

  // Date range
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      start: parseDate(new Date().toISOString().split('T')[0]),
      end: parseDate(
        new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
      ),
    }
  );

  useEffect(() => {
    if (selectedLocation) setLocation(selectedLocation);
    if (selectedFromLocation) setFromLocation(selectedFromLocation);
    if (selectedToLocation) setToLocation(selectedToLocation);
    if (selectedType) setTypeValue(selectedType);
  }, [selectedLocation, selectedFromLocation, selectedToLocation, selectedType]);

  const guestTypes = [
    { label: 'Adults', value: adults, setValue: setAdults, minValue: 1 },
    {
      label: 'Senior Adults',
      value: seniorAdults,
      setValue: setSeniorAdults,
      minValue: 0,
    },
    { label: 'Children', value: children, setValue: setChildren, minValue: 0 },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchParams: any = {
      type,
      dateRange,
      adults,
      seniorAdults,
      children,
    };
    if (type === 'tour' || type === 'hotel') {
      searchParams.location = location;
      if (typeValue) searchParams.selectedType = typeValue;
    } else if (type === 'transport') {
      searchParams.fromLocation = fromLocation;
      searchParams.toLocation = toLocation;
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
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // stack on mobile
          flexWrap: 'wrap',
          alignItems: 'stretch',
          gap: 2,
          p: 2,
        }}
      >
        {/* Location */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '220px' } }}>
          <Autocomplete
            value={location}
            onChange={(_, newValue) => {
              setLocation(newValue);
              onLocationChange?.(newValue);
            }}
            options={locations}
            getOptionLabel={option => option.label}
            renderInput={params => <TextField {...params} label="Select Destination" fullWidth />}
          />
        </Box>

        {/* Date Range */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '220px' } }}>
          <DateRangePicker
            label={dateRangeLabel || 'Check in - Check Out'}
            value={dateRange}
            onChange={setDateRange}
            radius="sm"
            variant="bordered"
            className="w-full"
          />
        </Box>

        {/* Type (if provided) */}
        {typesOptions.length > 0 && (
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '200px' } }}>
            <FormControl fullWidth>
              <InputLabel id="type-label">{typeLabel || 'Select Type'}</InputLabel>
              <Select
                labelId="type-label"
                value={typeValue}
                onChange={e => {
                  setTypeValue(e.target.value);
                  onTypeChange?.(e.target.value);
                }}
              >
                {typesOptions.map(option => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Guests */}
        <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '180px' } }}>
          <FormControl fullWidth>
            <InputLabel id="guests-label">Guests</InputLabel>
            <Select
              labelId="guests-label"
              renderValue={() => (
                <div className="flex items-center gap-2">
                  <Image src={GuestsIcon} alt="Guests" width={28} />
                  <span>{adults + seniorAdults + children} Guests</span>
                </div>
              )}
            >
              {guestTypes.map(({ label, value, setValue, minValue }) => (
                <MenuItem key={label}>
                  <div className="flex justify-between w-full items-center">
                    <span>{label}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="small"
                        onClick={() => setValue(value - 1)}
                        disabled={value <= minValue}
                      >
                        -
                      </Button>
                      <span>{value}</span>
                      <Button type="button" size="small" onClick={() => setValue(value + 1)}>
                        +
                      </Button>
                    </div>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Search Button */}
        <Box
          sx={{
            flex: { xs: '1', md: '0' },
            minWidth: { xs: '100%', md: 'auto' },
          }}
        >
          <Button
            type="submit"
            sx={{
              width: '100%',
              backgroundColor: theme.colors.carrotOrange,
              color: theme.colors.milkWhite,
              fontWeight: theme.typography.fontWeight.bold,
              '&:hover': {
                backgroundColor: `${theme.colors.carrotOrange}90`,
              },
            }}
          >
            SEARCH
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default DynamicSearchTab;
