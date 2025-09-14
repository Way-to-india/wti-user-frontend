"use client"
import { Box, TextField, MenuItem, Button, FormControl, InputLabel, InputAdornment, Select } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import ScheduleIcon from '@/assets/icons/schedule.png'
import TravelPersonalInfo from "./TravelPersonalInfo";

const TravelDetails:React.FC = () => {

    const [dateRange, setDateRange] = useState('');
    const [pax, setPax] = useState(1)

    return (
        <>

            <h2 className="text-2xl font-semibold text-gray-800">Traveler Details</h2>
                <div className="inline-block">
                    <h3 className="text-sm mt-8 font-semibold text-gray-800">TRAVEL INFORMATION</h3>
                    <div className="border-t-2 border-carrot-orange mt-1"></div>
                </div>

            <div className="flex-1 flex items-center my-6 gap-4">
                    <FormControl>
                        <div className="border border-gray-400 rounded-md px-3 py-3 flex items-center">
                            <Image
                                src={ScheduleIcon}
                                alt='Schedule Icon'
                                width={24}
                                height={24}
                                className="mr-2 text-gray-400"
                            />
                            <input
                                type="date"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full outline-none"
                            />
                        </div>
                    </FormControl>
                    <FormControl>
                            <Select
                                labelId="noPax-label"
                                id="noPax"
                                value={pax} 
                                onChange={(e) => setPax(e.target.value as number)} 
                                renderValue={(selected) => `No. of Pax: ${selected}`}
                                className=""
                            >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={6}>6</MenuItem>
                                <MenuItem value={7}>7</MenuItem>
                                <MenuItem value={8}>8</MenuItem>
                            </Select>
                    </FormControl>


            </div>

            <div className="inline-block my-4">
                    <h3 className="text-sm mt-8 font-semibold text-gray-800">PASSENGER INFORMATION</h3>
                    <div className="border-t-2 border-carrot-orange mt-1"></div>
                </div>

            {Array.from({ length: pax }).map(( _ , index) => (
                <>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">#{index + 1}</h3>
                    <TravelPersonalInfo index={index} />
                </>
            ))}

            <Button
                variant="contained"
                className={`px-3 ml-auto rounded-md font-bold flex items-center justify-center my-2 ${false ? 'border-2 border-green-600 bg-green-300 text-green-600 '  : `bg-[#FF8B02] text-white`}`}
            >
                Save & Continue
            </Button>

        </>
    )
}

export default TravelDetails
