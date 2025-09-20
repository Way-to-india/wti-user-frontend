'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/layout/navbar/NavBar';

import { Box, Typography, CircularProgress, Grid } from '@mui/material';

interface RoomPageProps {
  params: {
    id: string;
  };
}

export default function RoomSelectionPage({ params }: RoomPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div>
      <NavBar />
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Select Your Room
        </Typography>
        <Grid container spacing={3}>
          {/* Room cards will go here */}
        </Grid>
      </Box>
    </div>
  );
}
