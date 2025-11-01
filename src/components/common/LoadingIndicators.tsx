'use client';
import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

interface LoadingIndicatorsProps {
    isRetrying: boolean;
    isSearching: boolean;
    isFiltering: boolean;
    loading: boolean;
    retryCount: number;
}

const LoadingIndicators: React.FC<LoadingIndicatorsProps> = ({
    isRetrying,
    isSearching,
    isFiltering,
    loading,
    retryCount,
}) => {
    const theme = useTheme();

    // Retry Indicator (Bottom Right)
    const RetryIndicator = () => (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
                backgroundColor: theme.colors.carrotOrange,
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
            }}
        >
            <CircularProgress size={20} sx={{ color: 'white' }} />
            <Box>
                <Box sx={{ fontWeight: 600, fontSize: '14px' }}>Retrying connection...</Box>
                <Box sx={{ fontSize: '12px', opacity: 0.9 }}>Attempt {retryCount} of 3</Box>
            </Box>
        </Box>
    );

    // Loading Indicator (Bottom Right)
    const LoadingIndicator = ({ message }: { message: string }) => (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                zIndex: 1000,
                backgroundColor: theme.colors.carrotOrange,
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                animation: 'slideIn 0.3s ease-out',
            }}
        >
            <CircularProgress size={20} sx={{ color: 'white' }} />
            <Box sx={{ fontWeight: 600, fontSize: '14px' }}>{message}</Box>
        </Box>
    );

    // Filtering Modal (Center)
    const FilteringModal = () => (
        <Box
            sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000,
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                color: 'white',
                padding: '24px 32px',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                minWidth: '250px',
            }}
        >
            <CircularProgress size={40} sx={{ color: theme.colors.carrotOrange }} />
            <Box sx={{ fontWeight: 600, fontSize: '16px', marginTop: '12px' }}>
                Applying Filters
            </Box>
            <Box sx={{ fontSize: '13px', opacity: 0.9, textAlign: 'center' }}>
                Finding the best tours for you...
            </Box>
        </Box>
    );

    return (
        <>
            {isRetrying && <RetryIndicator />}
            {(loading || isSearching) && !isFiltering && !isRetrying && (
                <LoadingIndicator message={loading ? 'Fetching tours...' : 'Searching tours...'} />
            )}
            {isFiltering && <FilteringModal />}
        </>
    );
};

export default LoadingIndicators;