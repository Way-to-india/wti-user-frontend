'use client';
import React from 'react';
import { Box, Pagination } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

export interface DynamicPaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  size?: 'small' | 'medium' | 'large';
  showFirstButton?: boolean;
  showLastButton?: boolean;
  className?: string;
}

/**
 * A reusable pagination component with consistent styling for use across the application
 */
const DynamicPagination: React.FC<DynamicPaginationProps> = ({
  currentPage,
  totalPages,
  onChange,
  size = 'medium',
  showFirstButton = false,
  showLastButton = false,
  className,
}) => {
  const theme = useTheme();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      mt: 4 
    }} className={className}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onChange}
        size={size}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        sx={{
          '& .MuiPaginationItem-root': {
            color: theme.colors.heavyMetal,
            fontFamily: theme.typography.fontFamily.regular,
          },
          '& .Mui-selected': {
            backgroundColor: `${theme.colors.carrotOrange} !important`,
            color: theme.colors.milkWhite,
            fontFamily: theme.typography.fontFamily.bold,
          },
          '& .MuiPaginationItem-page:hover': {
            backgroundColor: theme.colors.milkWhite,
          },
        }}
      />
    </Box>
  );
};

export default DynamicPagination;