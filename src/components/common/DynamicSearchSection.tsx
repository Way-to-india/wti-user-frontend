'use client';
import React, { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

export interface DynamicSearchSectionProps {
  type: 'tour' | 'hotel' | 'transport';
  title?: string;
  searchComponent: ReactNode;
  totalItems?: number;
  loading?: boolean;
  onEnquiryClick?: () => void;
}

const DynamicSearchSection: React.FC<DynamicSearchSectionProps> = ({
  type,
  title,
  searchComponent,
  totalItems = 0,
  loading = false,
  onEnquiryClick
}) => {
  const theme = useTheme();

  // Default titles if not provided
  const defaultTitles = {
    tour: 'Find Your Perfect Tour',
    hotel: 'Find Your Perfect Stay',
    transport: 'Find Your Perfect Transport'
  };

  // Determine the title to display
  const displayTitle = title || defaultTitles[type] || 'Search';

  // Handle enquiry click
  const handleEnquiryClick = () => {
    if (onEnquiryClick) {
      onEnquiryClick();
    } else {
      // Default action if no handler is provided
      console.log('Enquiry clicked');
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: theme.colors.carrotOrange,
      padding: '2rem 0',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        width: '100%',
        px: 2,
      }}>
        {/* Optional Title */}
        {displayTitle && (
          <Typography
            sx={{
              color: theme.colors.milkWhite,
              fontSize: theme.typography.fontSize.h4,
              mb: 2,
            }}
          >
            {displayTitle}
          </Typography>
        )}

        {/* Search Component (HotelsTab, ToursTab, etc.) */}
        <Box>
          {searchComponent}
        </Box>
        
        {/* Results Info */}
        <Box sx={{ 
          mt: 2,
          mb: 0.5,
          fontSize: theme.typography.fontSize.body,
          fontWeight: theme.typography.fontWeight.regular,
          color: theme.colors.milkWhite
        }}>
          {loading ? (
            <Box className="h-6 w-64 bg-gray-200 bg-opacity-30 rounded animate-pulse" />
          ) : (
            <>
              We have found {totalItems} options matching your search,{' '}
              <Box
                component="span"
                sx={{ 
                  fontWeight: theme.typography.fontWeight.bold,
                  textDecoration: 'underline',
                  cursor: 'pointer'
                }}
                onClick={handleEnquiryClick}
              >
                Enquiry now
              </Box> to get customised option
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DynamicSearchSection;