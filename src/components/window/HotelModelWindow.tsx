// components/window/HotelModelWindow.tsx
import HotelDetails from '@/components/window/HotelDetails';
import WindowTabs from '@/components/window/Tab';
import styled from '@emotion/styled';
import { Box, Drawer, IconButton, InputAdornment, InputBase } from '@mui/material';
import { ArrowLeft, MagnifyingGlass } from '@phosphor-icons/react';
import React from 'react';

interface HotelModelWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchInput = styled(InputBase)(({ theme }) => ({
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '10px',
  width: '300px',
}));

const HotelModelWindow: React.FC<HotelModelWindowProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: '50vw', padding: 0 }}>
        <div className="shadow-md overflow-hidden">
          <div className="flex w-full m-4">
            <IconButton onClick={onClose}>
              <ArrowLeft size={32} />
            </IconButton>
            <h2 className="p-2 text-2xl font-semibold text-heavy-metal">SELECT A HOTEL</h2>
          </div>
        </div>

        {/* Search and Sort Section */}
        <div className="flex justify-between items-center m-8">
          <SearchInput
            placeholder="Search for a hotel"
            inputProps={{ 'aria-label': 'search' }}
            className="text-lg"
            startAdornment={
              <InputAdornment position="start" sx={{ marginRight: 2 }}>
                <MagnifyingGlass size={32} className="text-heavy-metal" />
              </InputAdornment>
            }
          />
          {/* <Select
                        defaultValue="Relevant"
                        variant="outlined"
                        sx={{ marginLeft: 2, width: 180 }}
                        className='rounded-xl'
                    >
                        <MenuItem value="Relevant">Sort by: Relevant</MenuItem>
                        <MenuItem value="Price">Sort by: Price</MenuItem>
                        <MenuItem value="Rating">Sort by: Rating</MenuItem>
                    </Select> */}
        </div>

        <div className="m-8">
          <WindowTabs />
          <HotelDetails />
        </div>
      </Box>
    </Drawer>
  );
};

export default HotelModelWindow;
