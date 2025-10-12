'use client';
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Autocomplete,
  TextField,
  Box,
  Paper,
  IconButton,
  Divider,
  Popover,
  Typography,
  Popper,
} from '@mui/material';
import { parseDate } from '@internationalized/date';
import { DateRangePicker } from '@nextui-org/date-picker';
import { useTheme } from '@/context/ThemeContext';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleIcon from '@mui/icons-material/People';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CategoryIcon from '@mui/icons-material/Category';

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

  
  const [adults, setAdults] = useState(1);
  const [seniorAdults, setSeniorAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [location, setLocation] = useState<LocationOption | null>(selectedLocation);
  const [fromLocation, setFromLocation] = useState<LocationOption | null>(selectedFromLocation);
  const [toLocation, setToLocation] = useState<LocationOption | null>(selectedToLocation);
  const [typeValue, setTypeValue] = useState<string>(selectedType);

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

  const handleDateRangeChange = (value: any) => {
    if (value) {
      setDateRange(value);
      onDateChange?.(value);
    }
  };

  const handleGuestsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGuestsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const totalGuests = adults + seniorAdults + children;

  const guestTypes = [
    { label: 'Adults', sublabel: 'Age 18+', value: adults, setValue: setAdults, minValue: 1 },
    {
      label: 'Senior Adults',
      sublabel: 'Age 60+',
      value: seniorAdults,
      setValue: setSeniorAdults,
      minValue: 0,
    },
    {
      label: 'Children',
      sublabel: 'Age 0-17',
      value: children,
      setValue: setChildren,
      minValue: 0,
    },
  ];

  const calculateDurationDays = (range: DateRange): number | null => {
    if (!range?.start || !range?.end) return null;

    try {
      let startDate: Date;
      let endDate: Date;

      if (typeof range.start.toDate === 'function') {
        startDate = range.start.toDate('UTC');
        endDate = range.end.toDate('UTC');
      } else if (range.start.year && range.start.month && range.start.day) {
        startDate = new Date(range.start.year, range.start.month - 1, range.start.day);
        endDate = new Date(range.end.year, range.end.month - 1, range.end.day);
      } else {
        startDate = new Date(range.start.toString());
        endDate = new Date(range.end.toString());
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays > 0 ? diffDays : null;
    } catch (error) {
      console.error('Error calculating duration:', error);
      return null;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const durationDays = calculateDurationDays(dateRange);

    const searchParams: any = {
      type,
      dateRange,
      durationDays,
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

    console.log('Search params:', searchParams); 
    onSearch(searchParams);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: theme.colors.milkWhite,
        borderRadius: '16px',
        overflow: 'visible',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      }}
    >
      <form onSubmit={handleSearchSubmit}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            alignItems: 'stretch',
            gap: { xs: 2, lg: 0 },
            p: { xs: 2, md: 2.5 },
          }}
        >
          {/* Location Field */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', lg: '1 1 auto' },
              minWidth: 0,
              maxWidth: { xs: '100%', lg: 'none' },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 0, lg: 1.5 },
              py: { xs: 0, lg: 0 },
              borderRight: { xs: 'none', lg: `1px solid ${theme.colors.carrotOrange}30` },
            }}
          >
            <LocationOnIcon
              sx={{
                color: theme.colors.carrotOrange,
                mr: 1.5,
                fontSize: 28,
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' },
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Autocomplete
                value={location}
                onChange={(_, newValue) => {
                  setLocation(newValue);
                  onLocationChange?.(newValue);
                }}
                options={locations}
                getOptionLabel={option => option.label}
                PopperComponent={props => (
                  <Popper
                    {...props}
                    sx={{
                      '& .MuiAutocomplete-paper': {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        mt: 1,
                      },
                      '& .MuiAutocomplete-listbox': {
                        maxHeight: '300px',
                        '& .MuiAutocomplete-option': {
                          padding: '12px 16px',
                          fontSize: '15px',
                          '&:hover': {
                            backgroundColor: `${theme.colors.carrotOrange}15`,
                          },
                          '&[aria-selected="true"]': {
                            backgroundColor: `${theme.colors.carrotOrange}20`,
                            '&:hover': {
                              backgroundColor: `${theme.colors.carrotOrange}25`,
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
                renderInput={params => (
                  <TextField
                    {...params}
                    placeholder="Select Destination"
                    variant="standard"
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      startAdornment: (
                        <>
                          <LocationOnIcon
                            sx={{
                              color: theme.colors.carrotOrange,
                              mr: 1,
                              fontSize: 24,
                              flexShrink: 0,
                              display: { xs: 'block', lg: 'none' },
                            }}
                          />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      '& .MuiInputBase-root': {
                        fontSize: '15px',
                        fontWeight: 500,
                      },
                      '& input::placeholder': {
                        color: theme.colors.heavyMetal,
                        opacity: 0.7,
                      },
                    }}
                  />
                )}
                fullWidth
              />
            </Box>
          </Box>

          {/* Date Range Field */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', lg: '1 1 auto' },
              minWidth: 0,
              maxWidth: { xs: '100%', lg: 'none' },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 0, lg: 1.5 },
              py: { xs: 0, lg: 0 },
              borderRight: { xs: 'none', lg: `1px solid ${theme.colors.carrotOrange}30` },
            }}
          >
            <CalendarTodayIcon
              sx={{
                color: theme.colors.carrotOrange,
                mr: 1.5,
                fontSize: 26,
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' },
              }}
            />
            <Box sx={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <DateRangePicker
                label={dateRangeLabel || 'Travel Dates'}
                value={dateRange}
                onChange={handleDateRangeChange}
                radius="sm"
                variant="bordered"
                classNames={{
                  base: 'w-full',
                  inputWrapper: 'border-none shadow-none h-auto py-0',
                  input: 'text-[14px] font-medium truncate',
                  label: 'text-[13px]',
                  selectorButton: 'ml-1',
                }}
              />
            </Box>
          </Box>

          {/* Type Field (if provided) */}
          {typesOptions.length > 0 && (
            <Box
              sx={{
                flex: { xs: '1 1 100%', lg: '0 1 auto' },
                minWidth: 0,
                maxWidth: { xs: '100%', lg: '200px' },
                display: 'flex',
                alignItems: 'center',
                px: { xs: 0, lg: 1.5 },
                py: { xs: 0, lg: 0 },
                borderRight: { xs: 'none', lg: `1px solid ${theme.colors.carrotOrange}30` },
              }}
            >
              <CategoryIcon
                sx={{
                  color: theme.colors.carrotOrange,
                  mr: 1.5,
                  fontSize: 26,
                  flexShrink: 0,
                  display: { xs: 'none', lg: 'block' },
                }}
              />
              <FormControl fullWidth variant="standard" sx={{ minWidth: 0 }}>
                <InputLabel
                  sx={{
                    position: 'relative',
                    transform: 'none',
                    fontSize: '13px',
                    color: theme.colors.heavyMetal,
                    opacity: 0.7,
                    mb: 0.5,
                  }}
                >
                  {typeLabel || 'Tour Theme'}
                </InputLabel>
                <Select
                  value={typeValue}
                  onChange={e => {
                    setTypeValue(e.target.value);
                    onTypeChange?.(e.target.value);
                  }}
                  disableUnderline
                  displayEmpty
                  startAdornment={
                    <CategoryIcon
                      sx={{
                        color: theme.colors.carrotOrange,
                        mr: 1,
                        fontSize: 24,
                        flexShrink: 0,
                        display: { xs: 'block', lg: 'none' },
                      }}
                    />
                  }
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                        mt: 1,
                        maxHeight: '400px',
                        '& .MuiMenuItem-root': {
                          padding: '12px 16px',
                          fontSize: '15px',
                          '&:hover': {
                            backgroundColor: `${theme.colors.carrotOrange}15`,
                          },
                          '&.Mui-selected': {
                            backgroundColor: `${theme.colors.carrotOrange}20`,
                            '&:hover': {
                              backgroundColor: `${theme.colors.carrotOrange}25`,
                            },
                          },
                        },
                      },
                    },
                  }}
                  sx={{
                    fontSize: '15px',
                    fontWeight: 500,
                    '& .MuiSelect-select': {
                      paddingTop: 0,
                      paddingBottom: 0,
                      paddingRight: '28px !important',
                    },
                    '& .MuiSelect-icon': {
                      right: 0,
                      color: theme.colors.carrotOrange,
                    },
                  }}
                >
                  <MenuItem value="" disabled>
                    <em style={{ opacity: 0.7 }}>Select Theme</em>
                  </MenuItem>
                  {typesOptions.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {/* Guests Field */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', lg: '0 1 auto' },
              minWidth: 0,
              maxWidth: { xs: '100%', lg: '160px' },
              display: 'flex',
              alignItems: 'center',
              px: { xs: 0, lg: 1.5 },
              py: { xs: 0, lg: 0 },
              borderRight: { xs: 'none', lg: `1px solid ${theme.colors.carrotOrange}30` },
            }}
          >
            <PeopleIcon
              sx={{
                color: theme.colors.carrotOrange,
                mr: 1.5,
                fontSize: 28,
                flexShrink: 0,
                display: { xs: 'none', lg: 'block' },
              }}
            />
            <Button
              onClick={handleGuestsClick}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                color: theme.colors.heavyMetal,
                padding: 0,
                minWidth: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <Box sx={{ textAlign: 'left', width: '100%', minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: '13px',
                    color: theme.colors.heavyMetal,
                    opacity: 0.7,
                    mb: 0.3,
                  }}
                >
                  Guests
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PeopleIcon
                    sx={{
                      color: theme.colors.carrotOrange,
                      fontSize: 20,
                      flexShrink: 0,
                      display: { xs: 'block', lg: 'none' },
                    }}
                  />
                  <Typography
                    sx={{
                      fontSize: '15px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                  </Typography>
                </Box>
              </Box>
            </Button>

            {/* Guests Popover */}
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleGuestsClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={{
                mt: 1,
              }}
            >
              <Box sx={{ p: 3, minWidth: 320 }}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    mb: 2,
                    color: theme.colors.heavyMetal,
                  }}
                >
                  Select Guests
                </Typography>
                {guestTypes.map(({ label, sublabel, value, setValue, minValue }, index) => (
                  <Box key={label}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        py: 2,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>{label}</Typography>
                        <Typography sx={{ fontSize: '13px', opacity: 0.7 }}>{sublabel}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton
                          size="small"
                          onClick={() => setValue(Math.max(minValue, value - 1))}
                          disabled={value <= minValue}
                          sx={{
                            border: `1px solid ${theme.colors.carrotOrange}`,
                            width: 32,
                            height: 32,
                            '&:hover': {
                              backgroundColor: `${theme.colors.carrotOrange}15`,
                            },
                            '&.Mui-disabled': {
                              border: `1px solid ${theme.colors.carrotOrange}30`,
                              opacity: 0.5,
                            },
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 18, color: theme.colors.carrotOrange }} />
                        </IconButton>
                        <Typography sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>
                          {value}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setValue(value + 1)}
                          sx={{
                            border: `1px solid ${theme.colors.carrotOrange}`,
                            width: 32,
                            height: 32,
                            '&:hover': {
                              backgroundColor: `${theme.colors.carrotOrange}15`,
                            },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 18, color: theme.colors.carrotOrange }} />
                        </IconButton>
                      </Box>
                    </Box>
                    {index < guestTypes.length - 1 && <Divider />}
                  </Box>
                ))}
              </Box>
            </Popover>
          </Box>

          {/* Search Button */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', lg: '0 0 auto' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: { xs: 0, lg: 1.5 },
              py: { xs: 1, lg: 0 },
            }}
          >
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SearchIcon sx={{ fontSize: { xs: 20, lg: 22 } }} />}
              sx={{
                backgroundColor: theme.colors.carrotOrange,
                color: theme.colors.milkWhite,
                fontWeight: 700,
                fontSize: { xs: '14px', lg: '15px' },
                px: { xs: 3, lg: 3.5 },
                py: { xs: 1.5, lg: 1.8 },
                borderRadius: '12px',
                textTransform: 'none',
                width: { xs: '100%', lg: 'auto' },
                minWidth: { lg: '140px' },
                whiteSpace: 'nowrap',
                boxShadow: `0 4px 12px ${theme.colors.carrotOrange}40`,
                '&:hover': {
                  backgroundColor: theme.colors.carrotOrange,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${theme.colors.carrotOrange}50`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Search Tours
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default DynamicSearchTab;
