// components/window/EnquiryForm.tsx
import React, { useState } from 'react';
import { ArrowLeft, Star } from '@phosphor-icons/react';
import { Drawer, Box, IconButton, InputBase, Button, TextField, InputLabel } from '@mui/material'
import styled from '@emotion/styled';
import Image from 'next/image';
import PlaceholderImage from "@/assets/images/destination.png"

interface ModelWindowProps {
    isOpen: boolean;
    onClose: () => void;
}

const SearchInput = styled(InputBase)(({ theme }) => ({
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    width: '300px',
}));

const placeholderData = {
    destination: "Valley of Flowers",
    category: "Trekking Tours in India",
    rating: 4.5,
    imageSrc: PlaceholderImage,
};

const EnquiryModelWindow: React.FC<ModelWindowProps> = ({ isOpen, onClose }) => {

    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        numPeople: '',
        message: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted', formData);
    };

    return (
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Box sx={{ width: "50vw", padding: 0 }}>
          <div className="shadow-md overflow-hidden">
            <div className="flex w-full m-4">
              <IconButton onClick={onClose}>
                <ArrowLeft size={32} />
              </IconButton>
              <h2 className="p-2 text-2xl font-semibold text-heavy-metal">
                ENQUIRY FORM
              </h2>
            </div>
          </div>

          <div className="mx-auto mt-8 inline-block text-start">
            {/* <div className='w-fit text-start mx-auto'>
                        <h1 className="text-4xl font-bold text-carrot-orange mb-2">{placeholderData.destination}</h1>
                    </div>
                    <div className="flex flex-wrap items-center my-4 text-start justify-center">
                        <div className='rounded-xl border-2 border-carrot-orange px-1'>
                            <span className="text-carrot-orange text-md font-[500] mr-2">{placeholderData.category}</span>
                        </div>
                        <Star size={20} className='ml-4' />
                        <span className="ml-1 text-gray-700">{placeholderData.rating} Ratings</span>
                    </div> */}
            <div className="mx-auto w-2/3">
              <Image
                src={placeholderData.imageSrc}
                alt="Placeholder Image"
                className="rounded-lg"
                width={700}
                height={400}
              />
            </div>
            {/* Form Section */}
            <div className="py-4 w-full mx-auto">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mx-auto w-fit"
              >
                <div className="flex flex-col">
                  {/* <span>Email</span> */}
                  <TextField
                    label="Email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex">
                  {/* <InputLabel /> */}
                  <TextField
                    label="Phone Number"
                    name="phone"
                    variant="outlined"
                    fullWidth
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mr-4"
                    // required
                  />
                  <TextField
                    label="Number of People"
                    name="numPeople"
                    variant="outlined"
                    fullWidth
                    value={formData.numPeople}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="flex flex-col">
                  {/* <span>Email</span> */}
                  <TextField
                    label="Subject"
                    name="subject"
                    variant="outlined"
                    fullWidth
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <TextField
                  label="Message"
                  name="message"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  style={{ backgroundColor: "#FF8C00", color: "#FFF" }}
                  fullWidth
                >
                  Submit
                </Button>
                <p className="text-gray-500 text-sm text-center">
                  Reply expected within 30-45 minutes during business hours (9
                  AM - 7 PM)
                </p>
              </form>
            </div>
          </div>
        </Box>
      </Drawer>
    );
};

export default EnquiryModelWindow;
