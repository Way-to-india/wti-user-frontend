// components/Reviews.tsx
import React from 'react';
import { reviews } from '@/app/trip-details/content.dto'; // Adjust import according to your structure

const Reviews = () => {
    return (
        <div>
            <h2 className="text-xl font-bold">Reviews</h2>
            {reviews.map((review, index) => (
                <div key={index} className="mb-4">
                    <h3 className="font-semibold">{review.name} - {review.date}</h3>
                    <p>{review.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default Reviews;
