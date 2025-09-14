import React from 'react';
import { Box, Typography, Button, Link, Tooltip } from '@mui/material';
import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import { LocationOn } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

// Define the location interface to match what's in hotel types
interface Location {
  latitude?: number;
  longitude?: number;
  address?: {
    addressLine1?: string;
    cityId?: {
      _path?: {
        segments?: string[];
      };
    };
    pinCode?: string;
  };
}

// Define the common card properties
export interface DynamicCardProps {
  id?: string;
  type: 'tour' | 'hotel' | 'transport';
  imageUrls: string[];
  title: string;
  description?: string;
  price: number | string;
  rating?: number;
  location?: Location;
  amenities?: string[];
  isAvailable?: boolean;
  category?: string;
  onActionClick?: () => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  id,
  type,
  imageUrls,
  title,
  description,
  price,
  rating = 5,
  location,
  amenities,
  isAvailable = true,
  category,
  onActionClick
}) => {
  const theme = useTheme();
  const router = useRouter();

  // Get button text based on the card type
  const getButtonText = () => {
    switch (type) {
      case 'tour':
        return 'View Package';
      case 'hotel':
        return 'Check Availability';
      case 'transport':
        return 'View Details';
      default:
        return 'View Details';
    }
  };

  // Handle card action click
  const handleActionClick = () => {
    if (onActionClick) {
      onActionClick();
    } else if (id) {
      // Default navigation if no custom handler is provided      // Handle transport route differently since we removed the 's'
      const path = type === 'transport' ? `/${type}/${id}` : `/${type}s/${id}`;
      router.push(path);
    }
  };

  // Calculate rating based on category for hotels
  const calculateRating = () => {
    if (rating) return rating;
    
    if (type === 'hotel' && category) {
      return category === 'Luxury' ? 5 : 
             category === 'Premium' ? 4 :
             category === 'Budget' ? 3 : 4;
    }
    
    return 5; // Default rating
  };

  // Format location string for hotels
  const getLocationString = () => {
    if (!location || !location.address) return '';

    const addressLine = location.address.addressLine1 || '';
    const cityName = location.address.cityId?._path?.segments?.[1] || '';
    const pinCode = location.address.pinCode ? ` - ${location.address.pinCode}` : '';

    return `${addressLine}${cityName ? `, ${cityName}` : ''}${pinCode}`;
  };

  // Handle view map action for hotels
  const handleViewMap = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement map view functionality
  };

  // Handle what's included action for hotels
  const handleWhatsIncluded = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implement what's included functionality
  };

  // Default image if no images are provided
  const imageUrl = imageUrls?.[0] || '/placeholder-image.jpg';
  const actualRating = calculateRating();

  // Remove fixed height and use flexbox for proper content distribution
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '320px',
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s',
        '&:hover': { 
          boxShadow: '2px 4px 8px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      {/* Image Container */}
      <Box sx={{ position: 'relative', width: '100%', height: '180px', flexShrink: 0 }}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </Box>

      {/* Content Container */}
      <Box sx={{ 
        p: 1.5,
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        justifyContent: 'space-between',
        height: type === 'transport' ? '250px' : '220px',
      }}>
        <Box>
          {/* Rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                sx={{
                  color: index < actualRating ? '#FDB827' : '#D1D5DB',
                  fontSize: '14px'
                }}
              />
            ))}
            <Typography 
              sx={{ 
                ml: 0.5,
                color: '#4B5563',
                fontSize: '12px',
                fontWeight: 400
              }}
            >
              ({actualRating})
            </Typography>
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#1F2937',
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>

          {/* Location for hotels */}
          {type === 'hotel' && location && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 1,
              gap: 0.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn sx={{ fontSize: 14, color: '#4B5563' }} />
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#4B5563',
                    fontWeight: 400,
                  }}
                >
                  {getLocationString()}
                </Typography>
              </Box>
              <Link
                href="#"
                onClick={handleViewMap}
                sx={{
                  fontSize: '12px',
                  color: theme.colors.carrotOrange,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                View Map
              </Link>
            </Box>
          )}

          {/* Description if available */}
          {description && (
            <Box sx={{ position: 'relative' }}>
              <Tooltip 
                title={description} 
                placement="top"
              >
                <Typography
                  ref={(el) => {
                    if (el) {
                      const isTruncated = el.scrollHeight > el.clientHeight;
                      el.setAttribute('data-truncated', isTruncated.toString());
                    }
                  }}
                  sx={{
                    fontSize: '12px',
                    color: '#4B5563',
                    mb: 1,
                    minHeight: 'auto',
                    display: '-webkit-box',
                    WebkitLineClamp: type === 'hotel' ? 1 : 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    '&[data-truncated="true"]': {
                      cursor: 'help',
                      '&::after': {
                        content: '"..."',
                        color: theme.colors.carrotOrange,
                        marginLeft: '2px'
                      }
                    }
                  }}
                >
                  {description}
                </Typography>
              </Tooltip>
            </Box>
          )}

          {/* Amenities for transport */}
          {type === 'transport' && amenities && amenities.length > 0 && (
            <Typography sx={{ fontSize: '11px', color: '#6B7280', mb: 1 }}>
              {amenities.join(' • ')}
            </Typography>
          )}
        </Box>

        {/* Bottom section with price and button - separated from the top content */}
        <Box sx={{ mt: 'auto' }}>
          {/* Price Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 1,
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: '12px',
                    color: '#4B5563',
                    fontWeight: 400
                  }}
                >
                  From
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: theme.colors.carrotOrange,
                  }}
                >
                  ₹{price}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: '10px',
                  color: '#6B7280',
                  fontWeight: 400
                }}
              >
                {type === 'transport' ? '(Excludes Taxes)' : '(Includes Taxes And Charges)'}
              </Typography>
            </Box>

            {/* What's included link for hotels */}
            {type === 'hotel' && (
              <Link
                href="#"
                onClick={handleWhatsIncluded}
                sx={{
                  fontSize: '12px',
                  color: theme.colors.carrotOrange,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                What&apos;s included?
              </Link>
            )}
          </Box>

          {/* Button */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            mb: 0.5,
          }}>
            <Button
              variant="contained"
              onClick={handleActionClick}
              disabled={type === 'hotel' && !isAvailable}
              sx={{
                backgroundColor: theme.colors.carrotOrange,
                color: 'white',
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 500,
                padding: '4px 16px',
                borderRadius: '50px',
                width: 'auto',
                minWidth: '180px',
                height: '32px',
                boxShadow: 'none',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: theme.colors.carrotOrange,
                  boxShadow: 'none',
                },
                '&:disabled': {
                  backgroundColor: '#E5E7EB',
                  color: '#9CA3AF',
                }
              }}
            >
              {getButtonText()}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DynamicCard;