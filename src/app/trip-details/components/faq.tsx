// components/FAQs.tsx
import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid2 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { faqs } from "@/app/trip-details/content.dto";

const FAQs = () => {
    return (
        <div>
            <Accordion className='my-4' defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h2 className="text-3xl font-bold">General FAQ's</h2>
                </AccordionSummary>
                <AccordionDetails>

                    <ul className="list-disc">
                        {/* Replace with your exclusions data */}
                        {faqs.map((item, index) => (
                            <div key={index}>
                                <p className='font-bold'>{item.question}</p>
                                <p>{item.answer}</p>
                            </div>
                        ))}
                    </ul>
                </AccordionDetails>
            </Accordion>

        </div>
    );
};

export default FAQs;
