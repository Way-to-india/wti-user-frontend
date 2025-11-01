import React from 'react';
import { Grid } from '@mui/material';
import DynamicCard from '../common/DynamicCard';
import NoToursFound from './TourNotFound';

type ToursGridProps = {
    tours: any[];
};

const ToursGrid: React.FC<ToursGridProps> = ({ tours }) => {
    if (tours.length === 0) {
        return <NoToursFound message="No tours found matching your search." />;
    }

    return (
        <Grid container spacing={3}>
            {tours.map(tour => (
                <Grid item xs={12} sm={6} lg={4} key={tour.id}>
                    <DynamicCard
                        key={tour.id} {...tour}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ToursGrid;