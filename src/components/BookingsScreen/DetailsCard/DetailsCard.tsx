"use client"
import { useState } from 'react'
import { Card, CardMedia, CardContent, Typography, Chip, Button, Box, Grid } from '@mui/material';
import Star from "@/assets/icons/Star.png"
import RoomIcon from '@mui/icons-material/Room';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image, { StaticImageData } from 'next/image'
import placeholderImage from "@/assets/images/destination.png"

interface detailsCardProp {
  image: StaticImageData,
  hotelName: string,
  star: string,
  dest: string,
  rating: string,
  roomNumber: string,
  description: string,
  price: number
}

const DetailsCard: React.FC<{ placeHolder: detailsCardProp }> = ({ placeHolder }) => {

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleUpgradeClick = () => {
    setIsSelected((prev) => !prev)
  }

  return (
    <Card sx={{ maxWidth: 345, borderRadius: '8px' }} className='flex-none'>

      {/** Card content */}
      <CardContent>
        {/** Image on top */}
        <Image className='w-full h-auto max-h-96' src={placeHolder.image} alt='image' width={400} height={400} />

        {/** Title */}
        <Typography gutterBottom variant="h5" component="div" className="mt-2 font-bold">
          {placeHolder.hotelName}
        </Typography>

        {/** Labels */}
        <Box display="flex" gap={1} mb={1}>
          <div className="rounded-md border border-gray-400 px-1">
            <span className="text-gray-400 text-sm">{`${placeHolder.star} Star`}</span>
          </div>
          <div className="flex justify-center place-items-center rounded-md border border-gray-400 px-1">
            <RoomIcon className='text-gray-400' />
            <span className="text-gray-400 text-sm">{placeHolder.dest}</span>
          </div>
        </Box>

        {/** star rating */}
        <div className="flex justify-start items-center">
          <Image
            src={Star}
            alt="Star Icon"
            width={10}
            height={10}
          />
          <p className="ml-1 text-gray-700 text-xs">{placeHolder.rating} Ratings</p>
        </div>

        {/** Room number */}
        <Typography variant="body2" color="text.secondary" className='my-4'>
          {placeHolder.roomNumber} room types
        </Typography>



        {/** Description */}
        <Typography variant="body2" color="text.secondary" className='text-sm'>
          {placeHolder.description}
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

export default DetailsCard;
