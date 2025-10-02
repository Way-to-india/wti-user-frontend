import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
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

  return (
    <div>
      <Accordion className="my-4" defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 className="text-3xl font-bold">Inclusions</h2>
        </AccordionSummary>
        <AccordionDetails>
          {is.length == 0 && <p className="text-gray-500 italic">No inclusions specified</p>}
          <ul className="list-disc ml-5">{is}</ul>
        </AccordionDetails>
      </Accordion>
      <Accordion className="my-4 mb-4" defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 className="text-3xl font-bold">Exclusions</h2>
        </AccordionSummary>
        <AccordionDetails>
          {es.length == 0 && <p className="text-gray-500 italic">No inclusions specified</p>}
          <ul className="list-disc ml-5">{es}</ul>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default InclusionsExclusions;
