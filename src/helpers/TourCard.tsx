import { Box, Typography, Button, Link, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { LocationOn } from '@mui/icons-material';
import { getLocationString } from '@/utils/TourCard';

export const RatingDisplay: React.FC<{ rating: number }> = ({ rating }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {[...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        sx={{
          color: index < rating ? '#FDB827' : '#D1D5DB',
          fontSize: '14px',
        }}
      />
    ))}
    <Typography
      sx={{
        ml: 0.5,
        color: '#4B5563',
        fontSize: '12px',
        fontWeight: 400,
      }}
    >
      ({rating})
    </Typography>
  </Box>
);

export const LocationDisplay: React.FC<{
  location: any;
  onViewMap: (e: React.MouseEvent) => void;
  theme: any;
}> = ({ location, onViewMap, theme }) => {
  const locationString = getLocationString(location);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1, minWidth: 0 }}>
        <LocationOn sx={{ fontSize: 14, color: '#4B5563', flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: '12px',
            color: '#4B5563',
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {locationString}
        </Typography>
      </Box>
      <Link
        href="#"
        onClick={onViewMap}
        sx={{
          fontSize: '12px',
          color: theme.colors.carrotOrange,
          textDecoration: 'none',
          flexShrink: 0,
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        View Map
      </Link>
    </Box>
  );
};

export const DescriptionDisplay: React.FC<{
  description: string;
  lines: number;
  theme: any;
}> = ({ description, lines, theme }) => (
  <Box sx={{ position: 'relative' }}>
    <Tooltip title={description} placement="top">
      <Typography
        sx={{
          fontSize: '12px',
          color: '#4B5563',
          mb: 1,
          minHeight: 'auto',
          display: '-webkit-box',
          WebkitLineClamp: lines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.4,
        }}
      >
        {description}
      </Typography>
    </Tooltip>
  </Box>
);

export const PriceSection: React.FC<{
  price: number | string;
  type: string;
  theme: any;
  onWhatsIncluded: (e: React.MouseEvent) => void;
}> = ({ price, type, theme, onWhatsIncluded }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      mb: 1,
    }}
  >
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
        <Typography
          sx={{
            fontSize: '12px',
            color: '#4B5563',
            fontWeight: 400,
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
          fontWeight: 400,
        }}
      >
        {type === 'transport' ? '(Excludes Taxes)' : '(Includes Taxes And Charges)'}
      </Typography>
    </Box>

    {type === 'hotel' && (
      <Link
        href="#"
        onClick={onWhatsIncluded}
        sx={{
          fontSize: '12px',
          color: theme.colors.carrotOrange,
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        What&apos;s included?
      </Link>
    )}
  </Box>
);