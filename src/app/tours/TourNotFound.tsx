'use client';
import { Box, Typography } from '@mui/material';
import { SearchOff } from '@mui/icons-material';

interface NoToursFoundProps {
  message?: string;
}

const NoToursFound: React.FC<NoToursFoundProps> = ({ message }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
      }}
    >
      <SearchOff sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        No Tours Found
      </Typography>
      <Typography variant="body1" sx={{ maxWidth: 400 }}>
        {message || "We couldn’t find any tours that match your filters. Try adjusting your search."}
      </Typography>
    </Box>
  );
};

export default NoToursFound;
