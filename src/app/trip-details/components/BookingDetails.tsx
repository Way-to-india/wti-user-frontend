// components/BookingPolicy.tsx
import React from "react";
import Image from "next/image";
import { bookingPolicy } from "@/app/trip-details/content.dto";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid2,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowIcon from "@/assets/icons/arrow-icon.svg";

// Define the structure for cancellation policies
interface CancellationPolicy {
  type: string; // e.g., "Full refund"
  description: string; // e.g., "If the cancellation is made more than [number] days before the trip departure date."
}

interface BookingPolicyProps {
  cancellationPolicies: CancellationPolicy[];
  actOfGodDescription: string;
  personalReasonsDescription: string;
}

const BookingPolicy: React.FC<BookingPolicyProps> = ({
  cancellationPolicies,
  actOfGodDescription,
  personalReasonsDescription,
}) => {
  return (
    <div>
      <Accordion className="my-4" defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <h2 className="text-3xl font-bold">Booking Policy</h2>
        </AccordionSummary>
        <AccordionDetails>
          <p className="underline decoration-[#FF8B02] underline-offset-4 font-medium text-sm my-2">
            <strong>CANCELLATION POLICY</strong>
          </p>
          <ul className="text-xs">
            {cancellationPolicies.map((policy, index) => (
              <li key={index}>
                <strong>{policy.type}:</strong> {policy.description}
              </li>
            ))}
          </ul>
          <p className="underline decoration-[#FF8B02] underline-offset-4 font-medium text-sm my-2">
            <strong>ACT OF GOD</strong>
          </p>
          <li className="text-xs">
            The tour operator may cancel the trip due to unforeseen
            circumstances beyond their control...
          </li>
          <p className="underline decoration-[#FF8B02] underline-offset-4 font-medium text-sm my-2">
            <strong>PERSONAL REASONS</strong>
          </p>
          <li className="text-xs">
            If you cancel the trip due to personal reasons (e.g., illness,
            family emergencies), the cancellation fees may apply...
          </li>
          <p className="underline decoration-[#FF8B02] underline-offset-4 font-medium text-sm my-2">
            <strong>TERMS & CONDITIONS</strong>
          </p>
          <div className="flex flex-row gap-2 items-center text-xs text-[#FF8B02] text-[16px] font-bold mt-8">
            <p>Read Now</p>
            <Image className="cursor-pointer scale-100 hover:scale-110 animate-bounce" src={ArrowIcon} alt="arrow-icon" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default BookingPolicy;
