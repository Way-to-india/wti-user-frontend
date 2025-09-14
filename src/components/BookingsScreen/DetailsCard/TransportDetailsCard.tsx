"use client"
import { useState } from 'react'
import { Card, CardMedia, CardContent, Typography, Button, Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Image, { StaticImageData } from "next/image"

interface detailsCardProp {
  image: string | StaticImageData,
  carrierName: string,
  minPassenger: number,
  maxPassenger: number,
  startLoc: string,
  startTime: string,
  title: string,
  desc: string,
  price: number
}

const TransportationDetailsCard: React.FC<{ placeHolder: detailsCardProp }> = ({ placeHolder }) => {

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleUpgradeClick = () => {
    setIsSelected((prev) => !prev)
  }

  return (
    <Card sx={{ maxWidth: 345, borderRadius: '8px' }} className='flex-none'>

      {/** Card content */}
      <CardContent>

        <Image className='w-full h-auto max-h-96' src={placeHolder.image} alt='image' width={400} height={400} />

        {/** Title */}
        <Typography gutterBottom variant="h5" component="div" className="mt-2 font-bold">
          {placeHolder.carrierName}
        </Typography>

        {/** Labels */}
        <div className="flex justify-start items-center space-x-2">
          <PersonOutlineIcon className='text-gray-400' />
          <span className="text-gray-400 text-sm">
            {`${placeHolder.minPassenger} ${placeHolder.maxPassenger > 0 ? `- ${placeHolder.maxPassenger}` : ''} passengers`}
          </span>
        </div>
        <div className='flex justify-start items-center space-x-2'>
          <AccessTimeIcon className='text-gray-400' />
          <span className="text-gray-400 text-sm">
            {placeHolder.startTime !== '' ? (<p>Starting from {placeHolder.startLoc} at <span className='text-carrot-orange font-bold'>{placeHolder.startTime}</span></p>) : "You decide the time"}
          </span>
        </div>

        {/** Room number */}
        <Typography variant="body2" color="text.secondary" className='my-4'>
          {placeHolder.title} room types
        </Typography>

        {/** Description */}
        <Typography variant="body2" color="text.secondary" className='text-sm'>
          {placeHolder.desc}
        </Typography>

        {/** Price and upgrade button section */}
        <Grid container justifyContent="space-between" alignItems="center" mt={3}>
          <div>
            <p className='text-xs'>Starting from</p>
            <span className="text-carrot-orange text-md font-[500] mr-2">{`${placeHolder.price} per night`}</span>
          </div>
          <Button
            variant="contained"
            className={`p-2 rounded-md flex items-center justify-center my-2 ${isSelected ? 'border-2 border-green-600 bg-green-300 text-green-600 ' : `bg-[#FF8B02] text-white`}`}
            onClick={handleUpgradeClick}
          >
            {isSelected ? (
              <>
                <div className='flex justify-center items-center'>
                  <CheckCircleOutlineIcon />
                  <p>Selected</p>
                </div>
              </>
            ) : 'Upgrade'}
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TransportationDetailsCard;
