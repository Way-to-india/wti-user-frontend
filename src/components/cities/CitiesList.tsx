'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { getCities, City } from '@/services/cityService';
import Image from 'next/image';
import Link from 'next/link';

const CitiesList: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const response = await getCities();
        if (response.success && response.data) {
          setCities(response.data);
        } else {
          setError(response.message || 'Failed to fetch cities');
        }
      } catch (err) {
        setError('An error occurred while fetching cities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box py={4}>
      <Typography variant="h4" component="h1" gutterBottom align="center" mb={4}>
        Popular Destinations
      </Typography>
      
      <Grid container spacing={3}>
        {cities.map((city) => (
          <Grid item xs={12} sm={6} md={4} key={city.id}>
            <Link href={`/cities/${city.id}`} style={{ textDecoration: 'none' }}>
              <Box 
                sx={{
                  position: 'relative',
                  height: 200,
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: 1,
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: 3,
                  }
                }}
              >
                <Image
                  src={city.imageUrl || '/images/placeholder-city.jpg'}
                  alt={city.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    color: 'white',
                  }}
                >
                  <Typography variant="h6">{city.name}</Typography>
                  {city.stateName && (
                    <Typography variant="body2">{city.stateName}</Typography>
                  )}
                </Box>
              </Box>
            </Link>
          </Grid>
        ))}
        
        {cities.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              No cities found.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CitiesList;