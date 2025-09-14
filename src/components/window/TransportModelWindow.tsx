// components/window/TransportModelWindow.tsx
import TransportDetails from '@/components/window/TransportDetails';
import styled from '@emotion/styled';
import { Box, Drawer, IconButton, InputAdornment, InputBase } from '@mui/material';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import { StaticImageData } from 'next/image';
import React from 'react';

interface TransportDetail {
  name: string;
  capacity: string;
  description: string;
  amenities: string[];
  price: number;
  imageUrl: StaticImageData; // Ensure each transport has an image URL
}

interface TransportModelWindowProps {
  isOpen: boolean;
  onClose: () => void;
  transportData: TransportDetail[];
}

const SearchInput = styled(InputBase)(({ theme }) => ({
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px',
  width: '300px',
}));

const TransportModelWindow: React.FC<TransportModelWindowProps> = ({
  isOpen,
  onClose,
  transportData,
}) => {
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: '50vw', padding: 0 }}>
        <div className="shadow-md overflow-hidden">
          <div className="flex w-full m-4">
            <IconButton onClick={onClose}>
              <ArrowLeft size={32} />
            </IconButton>
            <h2 className="p-2 text-2xl font-semibold text-heavy-metal">SELECT A TRANSPORTATION</h2>
          </div>
        </div>

        {/* Search and Sort Section */}
        <div className="flex justify-between items-center m-8">
          <SearchInput
            placeholder="Search for a transport"
            inputProps={{ 'aria-label': 'search' }}
            className="text-lg"
            startAdornment={
              <InputAdornment position="start" sx={{ marginRight: 2 }}>
                <MagnifyingGlass size={32} className="text-heavy-metal" />
              </InputAdornment>
            }
          />
          {/* <Select
                        defaultValue="Public"
                        variant="outlined"
                        sx={{ marginLeft: 2, width: 180 }}
                        className='rounded-xl'
                    >
                        <MenuItem value="Public">Public</MenuItem>
                        <MenuItem value="Private">Private</MenuItem>
                    </Select> */}
        </div>

        <div className="m-8">
          {/* <WindowTabs /> */}
          <TransportDetails transportData={transportData} />{' '}
          {/* Pass transport data to TransportDetails */}
        </div>
      </Box>
    </Drawer>
  );
};

export default TransportModelWindow;
