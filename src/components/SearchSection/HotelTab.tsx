'use client';
import React, { useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Button,
  InputAdornment,
  Autocomplete,
  TextField,
} from '@mui/material';
import Image from 'next/image';
import { MapPin } from '@phosphor-icons/react';
import GuestsIcon from '@/assets/icons/people_3.png';
import { parseDate } from '@internationalized/date';
import { DateRangePicker } from '@nextui-org/date-picker';
import { destinations } from './cityData.dto';
import { useRouter } from 'next/navigation';

const HotelTab = () => {
  const router = useRouter();

  const [location, setLocation] = useState<string | null>(null);
  const [dateRange, setValue] = useState({
    start: parseDate(new Date().toISOString().split('T')[0]),
    end: parseDate(
      new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
    ),
  });

  const [adults, setAdults] = useState(1);
  const [seniorAdults, setSeniorAdults] = useState(0);
  const [children, setChildren] = useState(0);

  const guestTypes = [
    { label: 'Adults', value: adults, setValue: setAdults, minValue: 1 },
    { label: 'Senior Adults', value: seniorAdults, setValue: setSeniorAdults, minValue: 0 },
    { label: 'Children', value: children, setValue: setChildren, minValue: 0 },
  ];

  const totalGuests = adults + seniorAdults + children;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = new URLSearchParams();
    if (location) query.set('city', location);
    if (dateRange?.start) query.set('checkIn', dateRange.start.toString());
    if (dateRange?.end) query.set('checkOut', dateRange.end.toString());
    query.set('guests', totalGuests.toString());

    router.push(`/hotels?${query.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-milk-white text-heavy-metal rounded-2xl overflow-hidden"
    >
      <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center gap-4 p-4">
        <div className="w-full lg:flex-1 mb-4 lg:mb-0">
          <Autocomplete
            value={location}
            onChange={(event, newValue) => setLocation(newValue)}
            options={destinations.map(option => option.label)}
            renderInput={params => (
              <TextField
                {...params}
                label="Select Destination"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin className="text-2xl text-gray-500" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            fullWidth
          />
        </div>

        <div className="w-full lg:flex-1 mb-4 lg:mb-0">
          <DateRangePicker
            label="Check in - Check Out"
            value={dateRange}
            onChange={setValue}
            radius="sm"
            variant="bordered"
            className="text-carrot-orange w-full"
          />
        </div>

        <div className="w-full lg:flex-1 mb-4 lg:mb-0">
          <FormControl fullWidth>
            <InputLabel id="guests-label">Guests</InputLabel>
            <Select
              labelId="guests-label"
              value={totalGuests}
              renderValue={() => (
                <div className="flex items-center gap-2">
                  <Image src={GuestsIcon} alt="Guests" width={28} />
                  <span>{totalGuests} Guests</span>
                </div>
              )}
            >
              {guestTypes.map(({ label, value, setValue, minValue }) => (
                <MenuItem key={label} disableRipple>
                  <div className="flex justify-between w-full items-center">
                    <span>{label}</span>
                    <div className="flex flex-row justify-end items-center">
                      <Button
                        type="button"
                        onClick={() => setValue(value - 1)}
                        disabled={value <= minValue}
                        className="w-8 h-8 border border-gray-400 rounded-md flex items-center justify-center bg-carrot-orange text-xl text-heavy-metal"
                      >
                        -
                      </Button>
                      <span className="px-2">{value}</span>
                      <Button
                        type="button"
                        onClick={() => setValue(value + 1)}
                        className="w-8 h-8 border border-gray-400 rounded-md flex items-center justify-center bg-carrot-orange text-xl text-heavy-metal"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Button
          type="submit"
          className="w-full lg:w-auto bg-carrot-orange rounded-lg text-white px-6 py-3 lg:px-8 lg:py-4 font-bold hover:bg-orange-600 transition duration-300"
        >
          SEARCH
        </Button>
      </div>
    </form>
  );
};

export default HotelTab;
