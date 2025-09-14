'use client';
import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

interface DynamicCardSkeletonProps {
  type: 'tour' | 'hotel' | 'transport';
}

const DynamicCardSkeleton: React.FC<DynamicCardSkeletonProps> = ({ type }) => {
  const theme = useTheme();
  
  return (
    <Card 
      elevation={1}
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        height: type === 'transport' ? 200 : 380,
        position: 'relative',
      }}
    >
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={type === 'transport' ? 90 : 200}
        animation="wave"
        sx={{ 
          backgroundColor: `${theme.colors.carrotOrange}15`,
        }}
      />
      
      <CardContent>
        {/* Title skeleton */}
        <Skeleton 
          variant="text" 
          width="85%" 
          height={32}
          animation="wave"
          sx={{ 
            backgroundColor: `${theme.colors.carrotOrange}15`,
            marginBottom: 1 
          }}
        />
        
        {/* Location/subtitle skeleton */}
        <Skeleton 
          variant="text" 
          width="60%" 
          height={24}
          animation="wave"
          sx={{ 
            backgroundColor: `${theme.colors.carrotOrange}15`,
            marginBottom: 1 
          }}
        />
        
        {/* Description skeleton - multiple lines */}
        {type !== 'transport' && (
          <>
            <Skeleton 
              variant="text" 
              width="100%" 
              height={18}
              animation="wave"
              sx={{ 
                backgroundColor: `${theme.colors.carrotOrange}15`,
                marginBottom: 0.5 
              }}
            />
            <Skeleton 
              variant="text" 
              width="92%" 
              height={18}
              animation="wave"
              sx={{ 
                backgroundColor: `${theme.colors.carrotOrange}15`,
                marginBottom: 1 
              }}
            />
          </>
        )}
        
        {/* Price and rating skeleton */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Skeleton 
            variant="rectangular" 
            width="40%" 
            height={30}
            animation="wave"
            sx={{ 
              backgroundColor: `${theme.colors.carrotOrange}15`,
              borderRadius: 1
            }}
          />
          <Skeleton 
            variant="circular" 
            width={40} 
            height={40}
            animation="wave"
            sx={{ 
              backgroundColor: `${theme.colors.carrotOrange}15`,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default DynamicCardSkeleton;