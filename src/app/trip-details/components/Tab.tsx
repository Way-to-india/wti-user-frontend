// components/DetailsPage.tsx
import React, { useRef, useState } from "react";
import { Tabs, Tab, Box } from "@mui/material"; // Material UI for tabs if you prefer
import Itinerary from "./Itinerary";
import HotelDetails from "./HotelDetails";
import TransportationDetails from "./TransportationDetails";
import InclusionsExclusions from "./InclusionsExclusions";
import FAQs from "./faq";
import BookingPolicy from "./BookingDetails";
import Reviews from "./Reviews";
import { bookingPolicy } from "@/app/trip-details/content.dto";
import { IncluExclu } from "./InclusionsExclusions";
import { IItinerary } from "./helpers";

export interface TabSectionProps {
  ie: IncluExclu;
  itinerary: IItinerary;

}

const TabSection: React.FC<TabSectionProps> = ({ie, itinerary }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const hotelRef = useRef<HTMLDivElement>(null);
  const transportationRef = useRef<HTMLDivElement>(null);
  const inclusionsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);
  const bookingPolicyRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  console.log(itinerary);

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement>,
    index: number
  ) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setSelectedTab(index);
    }
  };

  return (
    <>
      <Box className="my-12" sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
        {
          <Tabs value={false}>
            {[
              { label: "Itinerary Details", ref: itineraryRef },
              // { label: "Hotel Details", ref: hotelRef },
              // { label: "Transportation Details", ref: transportationRef },
              { label: "Inclusions & Exclusions", ref: inclusionsRef },
              { label: "General FAQ's", ref: faqsRef },
              { label: "Booking Policy", ref: bookingPolicyRef },
              // { label: "Reviews", ref: reviewsRef },
            ].map((tab, index) => (
              <Tab
                className="font-bold"
                key={index}
                label={tab.label}
                onClick={() => handleScroll(tab.ref, index)}
                sx={{
                  marginRight: "10px",
                  borderRadius: "8px", // Make selected tab rounded
                  backgroundColor:
                    selectedTab === index ? "#FF8C00" : "transparent", // Darker carrot-orange for selected tab
                  color: selectedTab === index ? "#FFFFFF" : "#FF8B02", // Text color for selected vs unselected
                  transition: "background-color 0.3s, color 0.3s", // Smooth transition for background and text color
                  padding: "12px 24px", // Padding for a button-like appearance
                  "&:hover": {
                    backgroundColor:
                      selectedTab === index ? "#FF8C00" : "#FFD700", // Change on hover
                    color: selectedTab === index ? "#FFFFFF" : "#FF8B02", // Ensure hover text color remains consistent
                  },
                }}
              />
            ))}
          </Tabs>
        }
      </Box>
      {/* Section contents with refs */}
      <div className="mt-4">
        <div ref={itineraryRef}>
          <Itinerary
            hotelRef={hotelRef}
            transportationRef={transportationRef}
            itineraryprops={itinerary}
          />
        </div>
        <div ref={inclusionsRef} className="my-4">
          <InclusionsExclusions {...ie} />
        </div>
        <div ref={faqsRef} className="my-4">
          <FAQs />
        </div>
        <div ref={bookingPolicyRef} className="my-4">
          <BookingPolicy
            cancellationPolicies={bookingPolicy.cancellationPolicies}
            actOfGodDescription={bookingPolicy.actOfGodDescription}
            personalReasonsDescription={
              bookingPolicy.personalReasonsDescription
            }
          />
        </div>
        {/* <div ref={reviewsRef}><Reviews /></div> */}
      </div>
    </>
  );
};

export default TabSection;
