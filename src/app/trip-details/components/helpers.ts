export interface ICity {
  city_id: number;
  city_name: string;
  place_ids: Array<number>;
  blog_ids: Array<number>;
  state_id: number;
  image_urls: Array<string>;
}

export interface ITour {
  tour_id: number;
  tour_title: string;
  duration: string;
  start_city_id: number;
  image_urls: Array<string>;
  themes: Array<string>;
  description: string;
  highlights: Array<string>;
  best_recommended_months: Array<number>; // Recommended months for the tour
  duration_count: number;
  city_ids: Array<number>; // Array of city ids
  state_ids: Array<number>; // Array of city ids
  itinerary_id: number;
  activity_ids: Array<number>;
  contact: string;
  transportation_ids: Array<number>;
  travel_tip_ids: Array<number>;
  inclusions: Array<string>;
  exclusions: Array<string>;
  rating: number;
  is_active: boolean;
  deal_id: number;
}

export interface Routine {
  day: number; // Unix timestamp for the day
  title: string;
  image_url: string;
  general_details: string;
  specific_details: { [key: string]: string };
  state_id: number; // Should be able to retrieve state name from state id
  city_ids: Array<number>; // Dictionary with the respective city id, city name, blog
  places: Array<number>;
}

export interface IItinerary {
  itinerary_id: number;
  routines: Array<Routine>;
  associated_staff_ids: Array<number>;
}

export function convertNumbersToMonths(monthNumbers: number[]): string[] {
  const months = [
    "Jan\n",
    "Feb\n",
    "Mar\n",
    "Apr\n",
    "May\n",
    "Jun\n",
    "Jul\n",
    "Aug\n",
    "Sep\n",
    "Oct\n",
    "Nov\n",
    "Dec\n",
  ];

  return monthNumbers.map((num) => months[num]);
}

export interface TourData {
  tour: ITour;
  start_city: ICity;
  itinerary: IItinerary;
}

export interface FilteredToursResponse {
  message: string;
  data: TourData;
}

export const fetcher = (url: string): Promise<FilteredToursResponse> =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });
