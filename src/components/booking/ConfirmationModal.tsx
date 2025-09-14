import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Divider
} from '@mui/material';
import { GuestInformation } from './GuestInformationForm';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingDetails: {
    guests: GuestInformation[];
    checkIn: string;
    checkOut: string;
    roomType: string;
    totalAmount: number;
  };
}

export default function ConfirmationModal({ open, onClose, onConfirm, bookingDetails }: Props) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: 'rounded-lg'
      }}
    >
      <DialogTitle className="bg-gray-50 text-gray-800">
        <Typography variant="h6" className="font-semibold">
          Confirm Your Booking Details
        </Typography>
      </DialogTitle>
      <DialogContent className="mt-4">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box className="mb-4">
              <Typography className="font-medium text-gray-700 mb-2">
                Stay Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Check-in
                  </Typography>
                  <Typography>{formatDate(bookingDetails.checkIn)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Check-out
                  </Typography>
                  <Typography>{formatDate(bookingDetails.checkOut)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Room Type
                  </Typography>
                  <Typography>{bookingDetails.roomType}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box className="mb-4">
              <Typography className="font-medium text-gray-700 mb-2">
                Guest Information
              </Typography>
              {bookingDetails.guests.map((guest, index) => (
                <Box key={index} className="mb-3">
                  <Typography variant="subtitle2" className="font-medium">
                    Guest {index + 1} {index === 0 && '(Primary Contact)'}
                  </Typography>
                  <Typography variant="body2">
                    {guest.title} {guest.firstName} {guest.lastName}
                  </Typography>
                  {index === 0 && (
                    <Typography variant="body2" color="textSecondary">
                      {guest.email} • {guest.phone}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Box className="flex justify-between items-center">
              <Typography className="font-medium">Total Amount</Typography>
              <Typography className="font-semibold text-lg">
                ₹{bookingDetails.totalAmount.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions className="p-4 bg-gray-50">
        <Button onClick={onClose} variant="outlined" color="inherit">
          Go Back
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained"
          style={{ 
            backgroundColor: '#FF8B02',
            color: 'white'
          }}
          className="hover:bg-orange-600"
        >
          Confirm & Proceed
        </Button>
      </DialogActions>
    </Dialog>
  );
}
