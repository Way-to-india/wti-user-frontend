'use client'
import React, { useState } from 'react';

const Address = () => {
    return (
        <>
            <div className='col-span-9  pb-8'>
                <div className='my-10'>
                    <p className='text-xl font-bold'>Home Address</p>
                <p className='text-xs font-medium '>For safety purposes, we require your address</p>
                </div>
           
                <form className='text-xs space-y-4'>
                    {/* Name Fields */}
                    <div className='flex gap-4'>
                        <div className='flex-1'>
                            <label htmlFor='firstName' className='text-xs'>First name*</label>
                            <input
                                id='firstName'
                                name='firstName'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='Write here'
                                required
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor='lastName' className='text-xs'>Last name*</label>
                            <input
                                id='lastName'
                                name='lastName'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='Write here'
                                required
                            />
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className=''>
                        <label htmlFor='address' className='text-xs'>Address*</label>
                        <input
                            id='address'
                            name='address'
                            className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                            placeholder='1234 Main Street'
                            required
                        />
                        <div className='text-[#FF8B02] cursor-pointer'>
                            Add address line
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex-1'>
                            <label htmlFor='city' className='text-xs'>City*</label>
                            <input
                                id='city'
                                name='city'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='New York'
                                required
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor='zipCode' className='text-xs'>Zip Code*</label>
                            <input
                                id='zipCode'
                                name='zipCode'
                                className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                                placeholder='1234'
                                required
                            />
                        </div>
                    </div>
                    <div className=''>
                        <label htmlFor='state' className='text-xs'>State/Province*</label>
                        <select
                            id='state'
                            name='state'
                            className='border-2 rounded-lg h-10 text-sm flex items-center p-2 my-1 w-full'
                            required
                        >
                            <option value="CA" defaultChecked>California</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                            <option value="FL">Florida</option>
                            {/* Add more options as needed */}
                        </select>
                    </div>
                </form>
            </div>

        </>
    )
}

export default Address