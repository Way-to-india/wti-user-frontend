import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, FormGroup } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@/context/ThemeContext';

const categories = [
  'Rental Car',
  'Helicopter',
  'Horse',
  'Train',
];

const amenities = [
  'AC',
  'WiFi',
  'Guide',
  'Snacks',
  'Safety Gear',
];

interface FilterSidebarProps {
  onFilterChange?: (filters: { categories: string[]; amenities: string[] }) => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange }) => {
  const theme = useTheme();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const handleCategoryChange = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
    onFilterChange?.({ categories: newCategories, amenities: selectedAmenities });
  };

  const handleAmenityChange = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(newAmenities);
    onFilterChange?.({ categories: selectedCategories, amenities: newAmenities });
  };

  return (
    <Box sx={{
      width: '280px',
      backgroundColor: 'white',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
    }}>
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
      <Accordion defaultExpanded elevation={0} sx={{ '&.MuiAccordion-root': { borderBottom: '1px solid #E5E7EB', '&:before': { display: 'none' } } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
          <Typography sx={{ fontSize: theme.typography.fontSize.body, fontFamily: theme.typography.fontFamily.bold, color: theme.colors.heavyMetal }}>
            Categories
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    sx={{ color: '#9CA3AF', '&.Mui-checked': { color: theme.colors.carrotOrange } }}
                  />
                }
                label={<Typography sx={{ fontSize: theme.typography.fontSize.body, fontFamily: theme.typography.fontFamily.regular, color: theme.colors.heavyMetal }}>{category}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      {/* Amenities Section */}
      <Accordion defaultExpanded elevation={0} sx={{ '&.MuiAccordion-root': { borderBottom: '1px solid #E5E7EB', '&:before': { display: 'none' } } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2, py: 1 }}>
          <Typography sx={{ fontSize: theme.typography.fontSize.body, fontFamily: theme.typography.fontFamily.bold, color: theme.colors.heavyMetal }}>
            Amenities
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {amenities.map((amenity) => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    sx={{ color: '#9CA3AF', '&.Mui-checked': { color: theme.colors.carrotOrange } }}
                  />
                }
                label={<Typography sx={{ fontSize: theme.typography.fontSize.body, fontFamily: theme.typography.fontFamily.regular, color: theme.colors.heavyMetal }}>{amenity}</Typography>}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSidebar; 