'use client';
import React from 'react';
import { Box, Alert, AlertTitle, Button } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

interface ErrorDisplayProps {
  error: string;
  onReload: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onReload }) => {
  const theme = useTheme();

  const isTimeoutError = error.includes('timeout') || error.includes('exceeded');

  return (
    <Box sx={{ maxWidth: '600px', mx: 'auto', mt: 4 }}>
      <Alert
        severity="error"
        sx={{
          borderRadius: '12px',
          '& .MuiAlert-icon': {
            fontSize: '28px',
          },
        }}
      >
        <AlertTitle sx={{ fontWeight: 600, fontSize: '16px' }}>
          Unable to Load Tours
        </AlertTitle>
        <Box sx={{ fontSize: '14px', mt: 1 }}>
          {isTimeoutError
            ? "The request is taking longer than expected. We've tried multiple times but couldn't connect. Please check your internet connection and try again."
            : error}
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            onClick={onReload}
            variant="contained"
            sx={{
              backgroundColor: theme.colors.carrotOrange,
              color: 'white',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme.colors.carrotOrange,
                opacity: 0.9,
              },
            }}
          >
            Reload Page
          </Button>
        </Box>
      </Alert>
    </Box>
  );
};

export default ErrorDisplay;