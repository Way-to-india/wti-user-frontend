'use client'
import React, { useState } from 'react';
import { CreditCard } from "@phosphor-icons/react";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Checkbox, FormControlLabel } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CardDetails = () => {
    // const [selectedPayment, setSelectedPayment] = useState('debit');
    const [selectedPayment, setSelectedPayment] = useState('debit'); // Default selected payment option

    return (
        <Accordion defaultExpanded >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">3. Payment</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <form className='text-xs space-y-4'>
                    {/* Name Fields */}
                    <div className='flex gap-4'>
                        {/* Debit Card Option */}
                        <div className='flex-1'>
                            <div
                                className={`border-2 rounded-md h-10 text-sm flex gap-2 items-center p-2 cursor-pointer ${selectedPayment === 'debit' ? 'border-[#FF8B02] text-[#FF8B02]' : 'border-[#707070] text-gray-500'}`}
                                onClick={() => setSelectedPayment('debit')}
                            >
                                <CreditCard />
                                Pay with debit card
                            </div>
                        </div>

                        {/* Credit Card Option */}
                        <div className='flex-1'>
                            <div
                                className={`border-2 rounded-md h-10 text-sm flex gap-2 items-center p-2 cursor-pointer ${selectedPayment === 'credit' ? 'border-[#FF8B02] text-[#FF8B02]' : 'border-[#707070] text-gray-500'}`}
                                onClick={() => setSelectedPayment('credit')}
                            >
                                <CreditCard />
                                Pay with credit card
                            </div>
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className='flex gap-4 grid-cols-9'>
                        {/* Card Number */}
                        <div className='col-span-3'>
                            <label htmlFor='cardNumber' className='text-xs'>Card number*</label>
                            <input
                                id='cardNumber'
                                name='cardNumber'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='1234 5678 9101 1121'
                                required
                            />
                        </div>

                        {/* Cardholder Name */}
                        <div className='col-span-3'>
                            <label htmlFor='cardHolderName' className='text-xs'>Cardholder Name*</label>
                            <input
                                id='cardHolderName'
                                name='cardHolderName'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='John Doe'
                                required
                            />
                        </div>

                        {/* Expiration Date */}
                        <div className='col-span-1.5'>
                            <label htmlFor='expirationDate' className='text-xs'>Expiration*</label>
                            <input
                                id='expirationDate'
                                name='expirationDate'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='MM/YY'
                                required
                            />
                        </div>

                        {/* CVV */}
                        <div className='col-span-1.5'>
                            <label htmlFor='cvv' className='text-xs'>CVV*</label>
                            <input
                                id='cvv'
                                name='cvv'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='123'
                                required
                            />
                        </div>
                    </div>
                    
                    {/* Save Card Checkbox */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                id='saveCard'
                                name='saveCard'
                                sx={{ '&.Mui-checked': { color: '#FF8B02' } }} // Change checkbox color when checked
                            />
                        }
                        label={<Typography variant="caption">Save this card for future use</Typography>}

                    />
                </form>
            </AccordionDetails>
        </Accordion>
    );
}

export default CardDetails