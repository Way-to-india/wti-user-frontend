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
import { Add as AddIcon, Remove as RemoveIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';

// Type definitions
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

export interface FilterSidebarProps {
  type: 'tour' | 'hotel' | 'transport';
  options: FilterOptions;
  onFilterChange: (filters: any) => void;
  initialState?: Partial<FilterState>;
}

const INITIAL_ITEMS_TO_SHOW = 4;

const DynamicFilterSidebar: React.FC<FilterSidebarProps> = ({ 
  type, 
  options, 
  onFilterChange,
  initialState = {}
}) => {
  const theme = useTheme();
  
  // State management for all filter types
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
  const [roomCounts, setRoomCounts] = useState<RoomCount>(
    initialState.roomCounts || {}
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialState.priceRange || [3000, 60000]
  );
  
  // UI state for "show more" functionality
  const [showMoreState, setShowMoreState] = useState<{ [key: string]: boolean }>({
    categories: false,
    themes: false,
    destinations: false,
    amenities: false,
    durations: false,
  });

  // Generic handler for checkbox changes
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
    
    // Prepare filters object based on type
    let filters: any = {};
    if (type === 'tour') {
      filters = {
        themes: stateKey === 'themes' ? newArray : selectedThemes,
        destinations: stateKey === 'destinations' ? newArray : selectedDestinations,
        durations: stateKey === 'durations' ? newArray : selectedDurations,
        priceRange: priceRange,
      };
    } else if (type === 'hotel') {
      filters = {
        categories: stateKey === 'categories' ? newArray : selectedCategories,
        amenities: stateKey === 'amenities' ? newArray : selectedAmenities,
        rooms: roomCounts,
        priceRange: priceRange,
      };
    } else if (type === 'transport') {
      filters = {
        categories: stateKey === 'categories' ? newArray : selectedCategories,
        amenities: stateKey === 'amenities' ? newArray : selectedAmenities,
      };
    }
    
    onFilterChange(filters);
  };

  // Handle room count changes for hotels
  const handleRoomCountChange = (roomType: string, increment: boolean) => {
    const currentCount = roomCounts[roomType] || 0;
    const newCount = currentCount + (increment ? 1 : -1);
    
    if (newCount >= 0) {
      const newRoomCounts = { ...roomCounts, [roomType]: newCount };
      setRoomCounts(newRoomCounts);
      
      onFilterChange({ 
        categories: selectedCategories, 
        amenities: selectedAmenities,
        rooms: newRoomCounts,
        priceRange: priceRange,
      });
    }
  };

  // Handle price range changes
  const handlePriceRangeChange = (_: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange([newValue[0], newValue[1]]);
      
      const filters = type === 'tour' 
        ? { themes: selectedThemes, destinations: selectedDestinations, durations: selectedDurations, priceRange: newValue } 
        : { categories: selectedCategories, amenities: selectedAmenities, rooms: roomCounts, priceRange: newValue };
      
      onFilterChange(filters);
    }
  };

  // Toggle show more/less items
  const toggleShowMore = (section: string) => {
    setShowMoreState(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Get items to display based on show more/less state
  const getItemsToDisplay = (items?: FilterItem[], section?: string) => {
    if (!items || !section) return [];
    return showMoreState[section] ? items : items.slice(0, INITIAL_ITEMS_TO_SHOW);
  };

  // Render a checkbox filter section
  const renderCheckboxSection = (
    title: string,
    items?: FilterItem[],
    stateArray?: string[],
    setStateArray?: React.Dispatch<React.SetStateAction<string[]>>,
    stateKey?: string
  ) => {
    if (!items || !stateArray || !setStateArray || !stateKey) return null;
    
    const displayedItems = getItemsToDisplay(items, stateKey);
    
    return (
      <Accordion
        defaultExpanded
        elevation={0}
        sx={{
          '&.MuiAccordion-root': {
            borderBottom: '1px solid #E5E7EB',
            '&:before': {
              display: 'none',
            },
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            px: 2,
            py: 1,
            '& .MuiAccordionSummary-content': {
              my: 0,
            }
          }}
        >
          <Typography sx={{ 
            fontSize: theme.typography.fontSize.body,
            fontFamily: theme.typography.fontFamily.bold,
            color: theme.colors.heavyMetal,
          }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {displayedItems.map((item) => (
              <Box key={item.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={stateArray.includes(item.id)}
                      onChange={() => handleCheckboxChange(item.id, stateArray, setStateArray, stateKey)}
                      sx={{
                        color: '#9CA3AF',
                        '&.Mui-checked': {
                          color: theme.colors.carrotOrange,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ 
                        fontSize: theme.typography.fontSize.body,
                        fontFamily: theme.typography.fontFamily.regular,
                        color: theme.colors.heavyMetal,
                      }}>
                        {item.label}
                      </Typography>
                      {item.options && item.options.length > 0 && (
                        <ExpandMoreIcon sx={{ fontSize: 18, ml: 0.5 }} />
                      )}
                    </Box>
                  }
                />
                {item.options && item.options.length > 0 && stateArray.includes(item.id) && (
                  <Box sx={{ ml: 3 }}>
                    {item.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        control={
                          <Checkbox
                            checked={stateArray.includes(option.id)}
                            onChange={() => handleCheckboxChange(option.id, stateArray, setStateArray, stateKey)}
                            sx={{
                              color: '#9CA3AF',
                              '&.Mui-checked': {
                                color: theme.colors.carrotOrange,
                              },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ 
                            fontSize: theme.typography.fontSize.body,
                            fontFamily: theme.typography.fontFamily.regular,
                            color: theme.colors.heavyMetal,
                          }}>
                            {option.label}
                          </Typography>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </FormGroup>
          {items.length > INITIAL_ITEMS_TO_SHOW && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                onClick={() => toggleShowMore(stateKey)}
                sx={{
                  color: theme.colors.carrotOrange,
                  fontFamily: theme.typography.fontFamily.bold,
                  fontSize: theme.typography.fontSize.body,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {showMoreState[stateKey] ? `Show Less ${title}` : `Show More ${title}`}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  // Render the room count section for hotels
  const renderRoomsSection = () => {
    if (type !== 'hotel' || !options.rooms) return null;
    
    return (
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Typography sx={{ 
          fontSize: theme.typography.fontSize.body,
          fontFamily: theme.typography.fontFamily.bold,
          color: theme.colors.heavyMetal,
          mb: 2 
        }}>
          Number Of Rooms
        </Typography>
        {Object.keys(options.rooms).map((roomType) => (
          <Box
            key={roomType}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
          >
            <Typography sx={{ 
              fontSize: theme.typography.fontSize.body,
              fontFamily: theme.typography.fontFamily.regular,
              color: theme.colors.heavyMetal,
            }}>
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
                  '&.Mui-disabled': {
                    backgroundColor: '#F3F4F6',
                  }
                }}
              >
                <RemoveIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <Typography sx={{ 
                minWidth: '20px', 
                textAlign: 'center',
                fontSize: theme.typography.fontSize.body,
                fontFamily: theme.typography.fontFamily.regular,
                color: theme.colors.heavyMetal,
              }}>
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
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  // Render price range slider
  const renderPriceRangeSection = () => {
    if (!options.priceRange) return null;
    
    return (
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Typography sx={{ 
          fontSize: theme.typography.fontSize.body,
          fontFamily: theme.typography.fontFamily.bold,
          color: theme.colors.heavyMetal,
          mb: 2 
        }}>
          Price Range
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={options.priceRange.min}
          max={options.priceRange.max}
          sx={{
            '& .MuiSlider-thumb': {
              backgroundColor: theme.colors.carrotOrange,
            },
            '& .MuiSlider-track': {
              backgroundColor: theme.colors.carrotOrange,
            },
            '& .MuiSlider-rail': {
              backgroundColor: '#E5E7EB',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography sx={{ 
            fontSize: theme.typography.fontSize.body,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.heavyMetal,
          }}>
            ₹{priceRange[0]}
          </Typography>
          <Typography sx={{ 
            fontSize: theme.typography.fontSize.body,
            fontFamily: theme.typography.fontFamily.regular,
            color: theme.colors.heavyMetal,
          }}>
            ₹{priceRange[1]}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      width: '280px', 
      backgroundColor: 'white',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
      {/* Header */}
      <Typography
        sx={{
          fontSize: theme.typography.fontSize.h6,
          fontFamily: theme.typography.fontFamily.bold,
          color: theme.colors.heavyMetal,
          p: 2,
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        Refine Your Search
      </Typography>

      {/* Render filter sections based on type */}
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