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
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';

interface RoomCount {
  [key: string]: number;
}

interface FilterSidebarProps {
  onFilterChange: (filters: {
    categories: string[];
    amenities: string[];
    rooms: RoomCount;
    priceRange: number[];
  }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const theme = useTheme();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [roomCounts, setRoomCounts] = useState<RoomCount>({
    Standard: 1,
    Suite: 1,
    Deluxe: 0
  });

  const categories = [
    {
      id: '5star',
      title: '5 STAR',
      options: ['Deluxe', 'Luxury', 'Standard']
    },
    {
      id: '7star',
      title: '7 Star',
      options: []
    },
    {
      id: 'airbnb',
      title: 'AirBNB',
      options: []
    },
    {
      id: 'rentalFlat',
      title: 'Rental Flat',
      options: []
    },
    {
      id: 'houseBoat',
      title: 'House Boat',
      options: []
    }
  ];

  const amenitiesList = [
    'Suite',
    'Lunch Included',
    'Dinner Included',
    'Breakfast Included',
    'Pick up/drop off incl'
  ];

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    setSelectedAmenities(newAmenities);
    onFilterChange({ 
      categories: selectedCategories, 
      amenities: newAmenities, 
      rooms: roomCounts, 
      priceRange: [3000, 60000] 
    });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(newCategories);
    onFilterChange({ 
      categories: newCategories, 
      amenities: selectedAmenities, 
      rooms: roomCounts, 
      priceRange: [3000, 60000] 
    });
  };

  const handleRoomCountChange = (roomType: string, increment: boolean) => {
    const newCount = roomCounts[roomType] + (increment ? 1 : -1);
    if (newCount >= 0) {
      const newRoomCounts = { ...roomCounts, [roomType]: newCount };
      setRoomCounts(newRoomCounts);
      onFilterChange({ 
        categories: selectedCategories, 
        amenities: selectedAmenities, 
        rooms: newRoomCounts, 
        priceRange: [3000, 60000] 
      });
    }
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

      {/* Categories Section */}
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
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {categories.map((category) => (
              <Box key={category.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedCategories.includes(category.title)}
                      onChange={() => handleCategoryChange(category.title)}
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
                        {category.title}
                      </Typography>
                      {category.options.length > 0 && (
                        <ExpandMoreIcon sx={{ fontSize: 18, ml: 0.5 }} />
                      )}
                    </Box>
                  }
                />
                {category.options.length > 0 && selectedCategories.includes(category.title) && (
                  <Box sx={{ ml: 3 }}>
                    {category.options.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            checked={selectedCategories.includes(option)}
                            onChange={() => handleCategoryChange(option)}
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
                            {option}
                          </Typography>
                        }
                      />
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Amenities Section */}
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
            Amenities
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {amenitiesList.map((amenity) => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
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
                    {amenity}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      {/* Number of Rooms Section */}
      <Box sx={{ p: 2, borderBottom: '1px solid #E5E7EB' }}>
        <Typography sx={{ 
          fontSize: theme.typography.fontSize.body,
          fontFamily: theme.typography.fontFamily.bold,
          color: theme.colors.heavyMetal,
          mb: 2 
        }}>
          Number Of Rooms
        </Typography>
        {Object.entries(roomCounts).map(([roomType, count]) => (
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
                disabled={count === 0}
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
                {count}
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
    </Box>
  );
};

export default FilterSidebar; 