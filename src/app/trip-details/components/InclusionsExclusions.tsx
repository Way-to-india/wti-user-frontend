// components/InclusionsExclusions.tsx
import React from 'react';
// import { inclusions, exclusions } from "@/app/trip-details/content.dto";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Grid2 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface IncluExclu {
    inclusions: [string];
    exclusions: [string];
}

const InclusionsExclusions = (ie: IncluExclu) => {
  const is = [];
  for (let i = 0; i < ie.inclusions.length; ++i) {
    is.push(<li key={i}>{ie.inclusions[i]}</li>);
  }

  const es = [];
  for (let i = 0; i < ie.exclusions.length; ++i) {
    es.push(<li key={i}>{ie.exclusions[i]}</li>);
  }

  //  console.log(is);

  return (
    <div>
      <Accordion className="my-4" defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 className="text-3xl font-bold">Inclusions</h2>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="list-disc ml-5">
            {/* Replace with your inclusions data */}
            {is}
          </ul>
        </AccordionDetails>
      </Accordion>
      <Accordion className="my-4 mb-4" defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 className="text-3xl font-bold">Exclusions</h2>
        </AccordionSummary>
        <AccordionDetails>
          <ul className="list-disc ml-5">
            {/* Replace with your exclusions data */}
            {es}
          </ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default InclusionsExclusions;
