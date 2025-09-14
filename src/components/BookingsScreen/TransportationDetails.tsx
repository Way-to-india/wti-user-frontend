"use client";
import { TextField, InputAdornment, FormControl, MenuItem, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TransportDetailsCard from './DetailsCard/TransportDetailsCard';
import Image, { StaticImageData } from "next/image"
import placeholderImage from "@/assets/images/destination.png"


interface transportDetailsCardProp {
    image: StaticImageData,
    carrierName: string,
    minPassenger: number,
    maxPassenger: number,
    startLoc: string,
    startTime: string,
    title: string,
    desc: string,
    price: number
}

const transportDetails: transportDetailsCardProp[] = [{
    image: placeholderImage,
    carrierName: "Volvo",
    minPassenger: 24,
    maxPassenger: 0,
    startLoc: "Kashumere",
    startTime: "9:00",
    title: "Semi sleeper",
    desc: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut at voluptatum eaque.',
    price: 1500
}];

const TransportationDetails: React.FC = () => {

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-800 mt-10">Transportation Details</h2>
            <div className="inline-block">
                <h3 className="text-sm mt-4 font-semibold text-gray-800">IN YOUR DESTINATION</h3>
                <div className="border-t-2 border-carrot-orange mt-1"></div>
            </div>

            <div className='flex justify-start overflow-x-auto space-x-4 my-4'>
                {transportDetails.map((transport, index) => (
                    <TransportDetailsCard key={index} placeHolder={transport} />
                ))}
            </div>
        </>
    );
};

export default TransportationDetails;
