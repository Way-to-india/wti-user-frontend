'use client';
import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

/**
 * A skeleton loading component for the filter sidebar
 */
const DynamicFilterSidebarSkeleton: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: '12px',
        height: '100%'
      }}
    >
      {/* Filter title */}
      <Skeleton 
        animation="wave"
        height={32} 
        width="80%" 
        sx={{ 
          mb: 3,
          backgroundColor: `${theme.colors.carrotOrange}20`,
        }} 
      />

      {/* Filter sections - repeat 4 times for different filter categories */}
      {[...Array(4)].map((_, sectionIndex) => (
        <Box key={sectionIndex} sx={{ mb: 4 }}>
          {/* Section title */}
          <Skeleton 
            animation="wave"
            height={24} 
            width="60%" 
            sx={{ 
              mb: 2,
              backgroundColor: `${theme.colors.carrotOrange}20`,
            }} 
          />
          
          {/* Filter options - 3-5 options per section */}
          {[...Array(Math.floor(Math.random() * 3) + 3)].map((_, optionIndex) => (
            <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
              <Skeleton 
                animation="wave"
                variant="circular" 
                width={20} 
                height={20} 
                sx={{ 
                  mr: 1.5,
                  backgroundColor: `${theme.colors.carrotOrange}20`,
                }} 
              />
              <Skeleton 
                animation="wave"
                height={20} 
                width={`${Math.floor(Math.random() * 40) + 50}%`} 
                sx={{ 
                  backgroundColor: `${theme.colors.carrotOrange}20`,
                }} 
              />
            </Box>
          ))}
        </Box>
      ))}

      {/* Price range slider */}
      <Box sx={{ mt: 3, mb: 3 }}>
        <Skeleton 
          animation="wave"
          height={24} 
          width="70%" 
          sx={{ 
            mb: 2,
            backgroundColor: `${theme.colors.carrotOrange}20`,
          }} 
        />
        <Skeleton 
          animation="wave"
          height={40} 
          width="100%" 
          sx={{ 
            backgroundColor: `${theme.colors.carrotOrange}20`,
          }} 
        />
      </Box>

      {/* Apply filters button */}
      <Box sx={{ mt: 4 }}>
        <Skeleton 
          animation="wave"
          variant="rectangular" 
          height={48} 
          width="100%" 
          sx={{ 
            borderRadius: '8px',
            backgroundColor: `${theme.colors.carrotOrange}20`,
          }} 
        />
      </Box>
    </Paper>
  );
};

export default DynamicFilterSidebarSkeleton;