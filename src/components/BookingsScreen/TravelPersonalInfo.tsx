import React, { useState } from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Checkbox,
    FormControlLabel,
    Box,
    Grid,
    SelectChangeEvent
} from '@mui/material';

const TravelPersonalInfo: React.FC<{index: number}> = ({index}) => {
    const [title, setTitle] = useState<any>("");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [sameContactDetails, setSameContactDetails] = useState<boolean>(false);

    const handleTitleChange = (event: any) => {
        setTitle(event.target.value as string);
    };

    const handleCheckboxChange = (event: any) => {
        setSameContactDetails(event.target.checked);
    };

    return (
        <div>
            <Grid container columns={14} spacing={2} className='mb-4'>
                {/* Title Select */}
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <Select
                            labelId="title-label"
                            value={title}
                            onChange={(e: SelectChangeEvent<HTMLInputElement>) => {
                                handleTitleChange(e)
                            }}
                        >
                            <MenuItem value="Mr">Mr</MenuItem>
                            <MenuItem value="Mrs">Mrs</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                {/* Name Text Field */}
                <Grid item xs={4}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Grid>

                {/* Email Text Field */}
                <Grid item xs={4}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Grid>

                {/* Mobile Text Field */}
                <Grid item xs={4}>
                    <TextField
                        label="Mobile"
                        variant="outlined"
                        fullWidth
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                    />

                    { index == 0 ? (
                        <FormControlLabel
                    
                                            control={
                                                <Checkbox
                                                    checked={sameContactDetails}
                                                    onChange={handleCheckboxChange}
                                                    className='text-sm'
                                />
                            }
                            label={<p className='text-sm text-gray-400 italic'>Same contact details for other travelers</p>}
                        />
                    ) : ''}

                </Grid>
            </Grid>
        </div>
    );
};

export default TravelPersonalInfo;
