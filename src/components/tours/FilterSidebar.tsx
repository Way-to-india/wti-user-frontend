'use client';
import React, { useState } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography, Slider, Box, Accordion, AccordionSummary, AccordionDetails, Divider, Autocomplete, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Theme, City } from '@/services/tourService';
import { useTheme } from '@/context/ThemeContext';

interface FilterSidebarProps {
  themes: Theme[];
  selectedTheme: string | null;
  onThemeChange: (themeId: string | null) => void;
  cities: City[];
  selectedCity: string | null;
  onCityChange: (cityId: string | null) => void;
  selectedDuration: number | null;
  onDurationChange: (duration: number | null) => void;
}

const durations = ['Day tour', '5 Days', '7 Days', '15 Days or More'];
const bestTours = ['Winter', 'Spring', 'Summer'];

const INITIAL_THEMES_TO_SHOW = 4;
const INITIAL_CITIES_TO_SHOW = 4;

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  themes, 
  selectedTheme, 
  onThemeChange,
  cities,
  selectedCity,
  onCityChange,
  selectedDuration,
  onDurationChange
}) => {
  const theme = useTheme();
  const [budget, setBudget] = useState<[number, number]>([3000, 60000]);
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [showAllDurations, setShowAllDurations] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState<number[]>([0, 1]);

  const durationOptions = [
    { label: 'Short (1-3 Days)', value: 3 },
    { label: 'Medium (4-7 Days)', value: 7 },
    { label: 'Long (8-14 Days)', value: 14 },
    { label: 'Extended (15+ Days)', value: 15 }
  ];

  const displayedDurations = showAllDurations ? durationOptions : durationOptions.slice(0, 3);

  const handleBudgetChange = (_: any, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setBudget([newValue[0], newValue[1]]);
    }
  };

  const handleThemeCheckboxChange = (themeId: string) => {
    onThemeChange(selectedTheme === themeId ? null : themeId);
  };

  const handleCityCheckboxChange = (cityId: string) => {
    onCityChange(selectedCity === cityId ? null : cityId);
  };

  const handleDurationCheckboxChange = (duration: number) => {
    onDurationChange(selectedDuration === duration ? null : duration);
  };

  const handleAccordionChange = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordions(
      isExpanded 
        ? [...expandedAccordions, panel]
        : expandedAccordions.filter(item => item !== panel)
    );
  };

  const displayedThemes = showAllThemes ? themes : themes?.slice(0, INITIAL_THEMES_TO_SHOW);
  const displayedCities = showAllCities ? cities : cities?.slice(0, INITIAL_CITIES_TO_SHOW);

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

      {/* Tour Theme Section */}
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
            Tour Theme
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {displayedThemes?.map((themeItem) => (
              <FormControlLabel
                key={themeItem.id}
                control={
                  <Checkbox
                    checked={selectedTheme === themeItem.id}
                    onChange={() => handleThemeCheckboxChange(themeItem.id)}
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
                    {themeItem.label}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
          {themes?.length > INITIAL_THEMES_TO_SHOW && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                onClick={() => setShowAllThemes(!showAllThemes)}
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
                {showAllThemes ? 'Show Less Themes' : 'Show More Themes'}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Destination Section */}
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
            Destination
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {displayedCities?.map((city) => (
              <FormControlLabel
                key={city.id}
                control={
                  <Checkbox
                    checked={selectedCity === city.id}
                    onChange={() => handleCityCheckboxChange(city.id)}
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
                    {city.label}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
          {cities?.length > INITIAL_CITIES_TO_SHOW && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                onClick={() => setShowAllCities(!showAllCities)}
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
                {showAllCities ? 'Show Less Destinations' : 'Show More Destinations'}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Duration Section */}
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
            Duration
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <FormGroup sx={{ px: 2, pb: 1 }}>
            {displayedDurations.map((duration) => (
              <FormControlLabel
                key={duration.value}
                control={
                  <Checkbox
                    checked={selectedDuration === duration.value}
                    onChange={() => handleDurationCheckboxChange(duration.value)}
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
                    {duration.label}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
          {durationOptions.length > 3 && (
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography
                onClick={() => setShowAllDurations(!showAllDurations)}
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
                {showAllDurations ? 'Show Less Durations' : 'Show More Durations'}
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FilterSidebar; 