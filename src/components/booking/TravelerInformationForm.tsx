import React, { useState } from 'react';
import { TextField, FormControl, InputLabel, Select, MenuItem, Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';

export interface TravelerInformation {
  title: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  specialRequests?: string;
}

interface Props {
  travelerNumber: number;
  travelerInfo: TravelerInformation;
  onChange: (field: keyof TravelerInformation, value: string | number) => void;
  isPrimary?: boolean;
  isRemovable?: boolean;
  onRemove?: () => void;
  showContactFields?: boolean;
}

// Helper function to check if a field has an error
const hasError = (errors: Record<string, string>, field: string): boolean => {
  return field in errors;
};

export default function TravelerInformationForm({ 
  travelerNumber, 
  travelerInfo, 
  onChange, 
  isPrimary = false,
  isRemovable = false,
  onRemove,
  showContactFields = false
}: Props) {
  const theme = useTheme();
  const titleOptions = ["Mr.", "Mrs.", "Ms.", "Dr."];
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string | number) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'email':
        if (isPrimary && showContactFields && !value) {
          newErrors.email = 'Email is required for primary contact';
        } else if (value && typeof value === 'string') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.email = 'Please enter a valid email address';
          } else {
            delete newErrors.email;
          }
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (isPrimary && showContactFields && !value) {
          newErrors.phone = 'Phone number is required for primary contact';
        } else if (value && typeof value === 'string') {
          const phoneRegex = /^[\+]?[0-9\s-]{10,}$/;
          if (!phoneRegex.test(value)) {
            newErrors.phone = 'Please enter a valid phone number';
          } else {
            delete newErrors.phone;
          }
        } else {
          delete newErrors.phone;
        }
        break;
      case 'firstName':
      case 'lastName':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[field] = `${field === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (typeof value === 'string' && value.length < 2) {
          newErrors[field] = `${field === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        } else {
          delete newErrors[field];
        }
        break;
      case 'title':
        if (!value) {
          newErrors.title = 'Title is required';
        } else {
          delete newErrors.title;
        }
        break;
      case 'age':
        if (value && (typeof value === 'number' && (value < 1 || value > 120))) {
          newErrors.age = 'Please enter a valid age (1-120)';
        } else {
          delete newErrors.age;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: keyof TravelerInformation, value: string | number) => {
    onChange(field, value);
    validateField(field, value);
  };

  return (
    <Box className="mb-8 p-4 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" style={{ 
          color: theme.colors.heavyMetal,
          fontFamily: theme.typography.fontFamily.bold,
          fontSize: theme.typography.fontSize.h6,
          fontWeight: theme.typography.fontWeight.bold
        }}>
          Traveler {travelerNumber} {isPrimary && (
            <span className="ml-2 text-xs px-2 py-1 bg-[#FF8B02] text-white rounded-full">
              Primary Contact
            </span>
          )}
        </Typography>
        
        {isRemovable && onRemove && (
          <button
            onClick={onRemove}
            className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1"
            style={{
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.small,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Traveler
          </button>
        )}
      </div>

      <Grid container spacing={3}>
        {/* Title */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth error={hasError(errors, 'title')}>
            <InputLabel id={`title-label-${travelerNumber}`} style={{ 
              color: theme.colors.heavyMetal,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.small
            }}>Title*</InputLabel>
            <Select
              labelId={`title-label-${travelerNumber}`}
              value={travelerInfo.title}
              label="Title*"
              onChange={(e) => handleChange('title', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.colors.borderColor,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF8B02',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF8B02',
                },
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }}
            >
              {titleOptions.map((title) => (
                <MenuItem 
                  key={title} 
                  value={title}
                  sx={{
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.small
                  }}
                >
                  {title}
                </MenuItem>
              ))}
            </Select>
            {errors.title && (
              <Typography color="error" variant="caption" sx={{
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: '0.75rem'
              }}>
                {errors.title}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* First Name */}
        <Grid item xs={12} sm={4.5}>
          <TextField
            fullWidth
            label="First Name*"
            value={travelerInfo.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            error={hasError(errors, 'firstName')}
            helperText={errors.firstName}
            InputLabelProps={{
              style: { 
                color: theme.colors.heavyMetal,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }
            }}
            inputProps={{
              style: {
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }
            }}
            FormHelperTextProps={{
              style: {
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: '0.75rem'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.colors.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: '#FF8B02',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF8B02',
                },
                fontFamily: theme.typography.fontFamily.regular,
              },
            }}
          />
        </Grid>

        {/* Last Name */}
        <Grid item xs={12} sm={4.5}>
          <TextField
            fullWidth
            label="Last Name*"
            value={travelerInfo.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            error={hasError(errors, 'lastName')}
            helperText={errors.lastName}
            InputLabelProps={{
              style: { 
                color: theme.colors.heavyMetal,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }
            }}
            inputProps={{
              style: {
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }
            }}
            FormHelperTextProps={{
              style: {
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: '0.75rem'
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.colors.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: '#FF8B02',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF8B02',
                },
                fontFamily: theme.typography.fontFamily.regular,
              },
            }}
          />
        </Grid>

        {/* Age */}
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Age (Optional)"
            type="number"
            value={travelerInfo.age || ''}
            onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)}
            error={hasError(errors, 'age')}
            helperText={errors.age}
            inputProps={{ min: 1, max: 120 }}
            InputLabelProps={{
              style: { 
                color: theme.colors.heavyMetal,
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: theme.colors.borderColor,
                },
                '&:hover fieldset': {
                  borderColor: '#FF8B02',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF8B02',
                },
                fontFamily: theme.typography.fontFamily.regular,
              },
            }}
          />
        </Grid>

        {/* Gender */}
        <Grid item xs={12} sm={3}>
          <FormControl fullWidth>
            <InputLabel id={`gender-label-${travelerNumber}`} style={{ 
              color: theme.colors.heavyMetal,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.small
            }}>Gender (Optional)</InputLabel>
            <Select
              labelId={`gender-label-${travelerNumber}`}
              value={travelerInfo.gender || ''}
              label="Gender (Optional)"
              onChange={(e) => handleChange('gender', e.target.value)}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.colors.borderColor,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF8B02',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#FF8B02',
                },
                fontFamily: theme.typography.fontFamily.regular,
                fontSize: theme.typography.fontSize.small
              }}
            >
              {genderOptions.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.small
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Contact fields - only for primary contact */}
        {isPrimary && showContactFields && (
          <>
            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email*"
                type="email"
                value={travelerInfo.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                error={hasError(errors, 'email')}
                helperText={errors.email}
                InputLabelProps={{
                  style: { 
                    color: theme.colors.heavyMetal,
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.small
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.colors.borderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF8B02',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF8B02',
                    },
                    fontFamily: theme.typography.fontFamily.regular,
                  },
                }}
              />
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone*"
                value={travelerInfo.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                error={hasError(errors, 'phone')}
                helperText={errors.phone}
                placeholder="e.g., +91 9876543210"
                InputLabelProps={{
                  style: { 
                    color: theme.colors.heavyMetal,
                    fontFamily: theme.typography.fontFamily.regular,
                    fontSize: theme.typography.fontSize.small
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.colors.borderColor,
                    },
                    '&:hover fieldset': {
                      borderColor: '#FF8B02',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FF8B02',
                    },
                    fontFamily: theme.typography.fontFamily.regular,
                  },
                }}
              />
            </Grid>
          </>
        )}

        {/* Special Requests - only for primary */}
        {isPrimary && (
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Special Requests (Optional)"
              value={travelerInfo.specialRequests || ''}
              onChange={(e) => handleChange('specialRequests', e.target.value)}
              multiline
              rows={2}
              placeholder="Any special requirements or preferences..."
              InputLabelProps={{
                style: { 
                  color: theme.colors.heavyMetal,
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.fontSize.small
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.colors.borderColor,
                  },
                  '&:hover fieldset': {
                    borderColor: '#FF8B02',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#FF8B02',
                  },
                  fontFamily: theme.typography.fontFamily.regular,
                },
              }}
            />
          </Grid>
        )}
      </Grid>

      {/* Show a note about required fields */}
      <Typography variant="caption" className="mt-4 block" style={{ 
        color: theme.colors.textLight || '#757575',
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: '0.75rem' 
      }}>
        * Required fields
      </Typography>
    </Box>
  );
}
