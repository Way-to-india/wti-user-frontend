'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  Slider,
} from '@mui/material';
import { Add, Remove, ExpandMore } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';

export interface FilterItem {
  id: string;
  label: string;
  options?: FilterItem[];
}

export interface RoomCount {
  [key: string]: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterOptions {
  categories?: FilterItem[];
  themes?: FilterItem[];
  destinations?: FilterItem[];
  amenities?: FilterItem[];
  durations?: FilterItem[];
  rooms?: { [key: string]: number };
  priceRange?: PriceRange;
}

export interface FilterState {
  selectedCategories: string[];
  selectedThemes: string[];
  selectedDestinations: string[];
  selectedAmenities: string[];
  selectedDurations: string[];
  roomCounts: RoomCount;
  priceRange: [number, number];
}

interface FilterSidebarProps {
  type: 'tour' | 'hotel' | 'transport';
  options: FilterOptions;
  onFilterChange: (filters: any) => void;
  initialState?: Partial<FilterState>;
}

const INITIAL_ITEMS_TO_SHOW = 4;
const MAX_HEIGHT_BEFORE_SCROLL = '300px'; 

const DynamicFilterSidebar: React.FC<FilterSidebarProps> = ({
  type,
  options,
  onFilterChange,
  initialState = {},
}) => {
  const theme = useTheme();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialState.selectedCategories || []
  );
  const [selectedThemes, setSelectedThemes] = useState<string[]>(
    initialState.selectedThemes || []
  );
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    initialState.selectedDestinations || []
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialState.selectedAmenities || []
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>(
    initialState.selectedDurations || []
  );
  const [roomCounts, setRoomCounts] = useState<RoomCount>(initialState.roomCounts || {});
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialState.priceRange || [3000, 60000]
  );
  const [showMoreState, setShowMoreState] = useState<{ [key: string]: boolean }>({});

  const handleCheckboxChange = (
    itemId: string,
    stateArray: string[],
    setStateArray: React.Dispatch<React.SetStateAction<string[]>>,
    stateKey: string
  ) => {
    const newArray = stateArray.includes(itemId)
      ? stateArray.filter(id => id !== itemId)
      : [...stateArray, itemId];

    setStateArray(newArray);

    const filters = buildFilters(stateKey, newArray);
    onFilterChange(filters);
  };

  const buildFilters = (changedKey: string, changedValue: any) => {
    const baseFilters: any = { priceRange };

    if (type === 'tour') {
      return {
        ...baseFilters,
        themes: changedKey === 'themes' ? changedValue : selectedThemes,
        destinations: changedKey === 'destinations' ? changedValue : selectedDestinations,
        durations: changedKey === 'durations' ? changedValue : selectedDurations,
      };
    }

    if (type === 'hotel') {
      return {
        ...baseFilters,
        categories: changedKey === 'categories' ? changedValue : selectedCategories,
        amenities: changedKey === 'amenities' ? changedValue : selectedAmenities,
        rooms: changedKey === 'rooms' ? changedValue : roomCounts,
      };
    }

    return {
      categories: changedKey === 'categories' ? changedValue : selectedCategories,
      amenities: changedKey === 'amenities' ? changedValue : selectedAmenities,
    };
  };

  const handleRoomCountChange = (roomType: string, increment: boolean) => {
    const currentCount = roomCounts[roomType] || 0;
    const newCount = currentCount + (increment ? 1 : -1);

    if (newCount >= 0) {
      const newRoomCounts = { ...roomCounts, [roomType]: newCount };
      setRoomCounts(newRoomCounts);
      onFilterChange(buildFilters('rooms', newRoomCounts));
    }
  };

  const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange([newValue[0], newValue[1]]);
      onFilterChange({ ...buildFilters('priceRange', newValue), priceRange: newValue });
    }
  };

  const toggleShowMore = (section: string) => {
    setShowMoreState(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getItemsToDisplay = (items?: FilterItem[], section?: string) => {
    if (!items || !section) return [];
    return showMoreState[section] ? items : items.slice(0, INITIAL_ITEMS_TO_SHOW);
  };

  const renderCheckboxSection = (
    title: string,
    items?: FilterItem[],
    stateArray?: string[],
    setStateArray?: React.Dispatch<React.SetStateAction<string[]>>,
    stateKey?: string
  ) => {
    if (!items || !stateArray || !setStateArray || !stateKey) return null;

    const displayedItems = getItemsToDisplay(items, stateKey);
    const isExpanded = showMoreState[stateKey];
    const hasMoreItems = items.length > INITIAL_ITEMS_TO_SHOW;

    return (
      <Accordion
        defaultExpanded
        elevation={0}
        sx={{
          '&.MuiAccordion-root': {
            borderBottom: '1px solid #E5E7EB',
            '&:before': { display: 'none' },
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2, py: 1 }}>
          <Typography
            sx={{
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.heavyMetal,
            }}
          >
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Box
            sx={{
              maxHeight: isExpanded && hasMoreItems ? MAX_HEIGHT_BEFORE_SCROLL : 'none',
              overflowY: isExpanded && hasMoreItems ? 'auto' : 'visible',
              // Custom scrollbar styling
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#F3F4F6',
                borderRadius: '10px',
                margin: '4px 0',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#D1D5DB',
                borderRadius: '10px',
                '&:hover': {
                  background: '#9CA3AF',
                },
              },
              // Firefox scrollbar styling
              scrollbarWidth: 'thin',
              scrollbarColor: '#D1D5DB #F3F4F6',
            }}
          >
            <FormGroup sx={{ px: 2, pb: 1 }}>
              {displayedItems.map(item => (
                <FormControlLabel
                  key={item.id}
                  control={
                    <Checkbox
                      checked={stateArray.includes(item.id)}
                      onChange={() =>
                        handleCheckboxChange(item.id, stateArray, setStateArray, stateKey)
                      }
                      sx={{
                        color: '#9CA3AF',
                        '&.Mui-checked': { color: theme.colors.carrotOrange },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontSize: theme.typography.fontSize.body,
                        color: theme.colors.heavyMetal,
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              ))}
            </FormGroup>
          </Box>
          {hasMoreItems && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                onClick={() => toggleShowMore(stateKey)}
                sx={{
                  color: theme.colors.carrotOrange,
                  fontSize: theme.typography.fontSize.body,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': {
                    textDecoration: 'underline',
                    opacity: 0.8,
                  },
                }}
              >
                {showMoreState[stateKey] ? '− Show Less' : '+ Show More'}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  const renderRoomsSection = () => {
    if (type !== 'hotel' || !options.rooms) return null;

    return (
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Typography
          sx={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.heavyMetal,
            mb: 2,
          }}
        >
          Number Of Rooms
        </Typography>
        {Object.keys(options.rooms).map(roomType => (
          <Box
            key={roomType}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: theme.typography.fontSize.body,
                color: theme.colors.heavyMetal,
              }}
            >
              {roomType}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleRoomCountChange(roomType, false)}
                disabled={(roomCounts[roomType] || 0) === 0}
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  p: '2px',
                  minWidth: '24px',
                  height: '24px',
                }}
              >
                <Remove sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography sx={{ minWidth: '20px', textAlign: 'center' }}>
                {roomCounts[roomType] || 0}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleRoomCountChange(roomType, true)}
                sx={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '4px',
                  p: '2px',
                  minWidth: '24px',
                  height: '24px',
                }}
              >
                <Add sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderPriceRangeSection = () => {
    if (!options.priceRange) return null;

    return (
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Typography
          sx={{
            fontSize: theme.typography.fontSize.body,
            color: theme.colors.heavyMetal,
            mb: 2,
          }}
        >
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={options.priceRange.min}
          max={options.priceRange.max}
          sx={{
            '& .MuiSlider-thumb': { backgroundColor: theme.colors.carrotOrange },
            '& .MuiSlider-track': { backgroundColor: theme.colors.carrotOrange },
            '& .MuiSlider-rail': { backgroundColor: '#E5E7EB' },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography
            sx={{
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.heavyMetal,
            }}
          >
            ₹{priceRange[0].toLocaleString()}
          </Typography>
          <Typography
            sx={{
              fontSize: theme.typography.fontSize.body,
              color: theme.colors.heavyMetal,
            }}
          >
            ₹{priceRange[1].toLocaleString()}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        width: '280px',
        backgroundColor: 'white',
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          fontSize: theme.typography.fontSize.h6,
          color: theme.colors.heavyMetal,
          p: 2,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        Refine Your Search
      </Typography>

      {type === 'tour' && (
        <>
          {renderCheckboxSection('Tour Theme', options.themes, selectedThemes, setSelectedThemes, 'themes')}
          {renderCheckboxSection('Destination', options.destinations, selectedDestinations, setSelectedDestinations, 'destinations')}
          {renderCheckboxSection('Duration', options.durations, selectedDurations, setSelectedDurations, 'durations')}
          {renderPriceRangeSection()}
        </>
      )}

      {type === 'hotel' && (
        <>
          {renderCheckboxSection('Categories', options.categories, selectedCategories, setSelectedCategories, 'categories')}
          {renderCheckboxSection('Amenities', options.amenities, selectedAmenities, setSelectedAmenities, 'amenities')}
          {renderRoomsSection()}
          {renderPriceRangeSection()}
        </>
      )}

      {type === 'transport' && (
        <>
          {renderCheckboxSection('Categories', options.categories, selectedCategories, setSelectedCategories, 'categories')}
          {renderCheckboxSection('Amenities', options.amenities, selectedAmenities, setSelectedAmenities, 'amenities')}
          {renderPriceRangeSection()}
        </>
      )}
    </Box>
  );
};

export default DynamicFilterSidebar;