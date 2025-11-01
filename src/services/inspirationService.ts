import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';
import { getThemes } from './tourService';

interface InspirationalTour {
  id: string;
  title: string;
  description: string;
  url: string;
  themeId?: string;
  theme?: string;
}

interface ThemeGroup {
  id: string;
  name: string;
  tours: InspirationalTour[];
}

interface ToursResponseData {
  tours: Array<{ id: string; title: string; description: string }>;
}

// Function to get tours by themes for inspiration section
export const getInspirationalTours = async (): Promise<ApiResponse<ThemeGroup[]>> => {
  try {
    // First, get available themes
    const themesResponse = await getThemes();
    let themes =
      themesResponse.success && Array.isArray(themesResponse.data) ? themesResponse.data : [];

    // If no themes returned from API, use fallback themes
    if (themes.length === 0) {
      themes = [
        { id: 'winter', name: 'Winter Tours', description: '', label: 'Winter Tours' },
        { id: 'summer', name: 'Summer Holiday', description: '', label: 'Summer Holiday' },
        { id: 'luxury', name: 'Luxury Hotels', description: '', label: 'Luxury Hotels' },
        { id: 'culture', name: 'Cultural Tours', description: '', label: 'Cultural Tours' },
      ];
    }

    // Get tours for each theme
    const themeGroups: ThemeGroup[] = [];

    for (const theme of themes) {
      try {
        // Try to get tours by theme from API
        const toursResponse = await handleApiCall<
          ApiResponse<{ tours: Array<{ id: string; title: string; description: string }> }>
        >(
          async () => axios.get(`${endpoints.tours.getTours}?themeId=${theme.id}&limit=3`),
          `Tours for ${theme.name} fetched successfully`
        );

        if (
          toursResponse.success &&
          toursResponse.data &&
          Array.isArray(
            (
              toursResponse.data as unknown as {
                tours: Array<{ id: string; title: string; description: string }>;
              }
            ).tours
          )
        ) {
          const tours = (
            toursResponse.data as unknown as {
              tours: Array<{ id: string; title: string; description: string }>;
            }
          ).tours;
          themeGroups.push({
            id: theme.id,
            name: theme.name,
            tours: tours.map(tour => ({
              id: tour.id,
              title: tour.title,
              description: tour.description,
              url: `/${tour.id}`,
              themeId: theme.id,
              theme: theme.name,
            })),
          });
        }
      } catch (error) {
        console.error(`Error fetching tours for theme ${theme.name}:`, error);
        // Use fallback data for this theme
        themeGroups.push({
          id: theme.id,
          name: theme.name,
          tours: getFallbackTours(theme.id),
        });
      }
    }

    // If no theme groups could be created from API, use all fallback data
    if (themeGroups.length === 0) {
      const response: ApiResponse<ThemeGroup[]> = {
        success: true,
        statusCode: 200,
        message: 'Using fallback inspiration data',
        data: getFallbackThemeGroups(),
      };
      return response;
    }

    return {
      success: true,
      message: 'Inspirational tours fetched successfully',
      data: themeGroups,
      statusCode: 200, // Added the missing statusCode property
    };
  } catch (error) {
    console.error('Error fetching inspirational tours:', error);

    // Return fallback data in case of error
    return {
      success: true,
      message: 'Using fallback inspirational data due to error',
      data: getFallbackThemeGroups(),
      statusCode: 500, // Added the missing statusCode property for error case
    };
  }
};

// Fallback data by theme
const getFallbackTours = (themeId: string): InspirationalTour[] => {
  switch (themeId) {
    case 'winter':
      return [
        {
          id: 'w1',
          title: 'Rajasthan Tour Packages',
          description:
            'Rajasthan Tour Package as the name itself suggests, provides you all wonderful experiences that Rajasthan offers. Forts, Palaces, Cenotaphs, Havelis, Desert, Folk performances, Lakes and much more.',
          url: '/',
          themeId: 'winter',
          theme: 'Winter Tours',
        },
        {
          id: 'w2',
          title: 'Golden Triangle Tour With Varanasi',
          description:
            'Golden Triangle Tour With Varanasi. A tour that takes the travelers through some of the most culturally vibrant cities of India. The cities that the travelers visit in this Tour are rich in cultural and historical significance.',
          url: '/',
          themeId: 'winter',
          theme: 'Winter Tours',
        },
        {
          id: 'w3',
          title: 'Himachal Holiday Tour Package',
          description:
            'The Himachal holiday tour package takes you to visit the paradise of Himachal Pradesh. It gives you an experience of the very famous destinations of Manali and Shimla.',
          url: '/',
          themeId: 'winter',
          theme: 'Winter Tours',
        },
      ];
    case 'summer':
      return [
        {
          id: 's1',
          title: 'Goa Beach Vacation',
          description: 'Relax on the beautiful beaches of Goa with sun, sand, and sea.',
          url: '/',
          themeId: 'summer',
          theme: 'Summer Holiday',
        },
        {
          id: 's2',
          title: 'Kerala Backwaters Tour',
          description: 'Enjoy the calm and serene backwaters of Kerala with houseboat stays.',
          url: '/',
          themeId: 'summer',
          theme: 'Summer Holiday',
        },
        {
          id: 's3',
          title: 'Leh-Ladakh Adventure',
          description: 'Discover the rugged beauty of Leh-Ladakh with this adventure-filled tour.',
          url: '/',
          themeId: 'summer',
          theme: 'Summer Holiday',
        },
      ];
    case 'luxury':
      return [
        {
          id: 'l1',
          title: 'Royal Rajasthan Palace Stay',
          description: 'Experience royal living in converted palace hotels across Rajasthan.',
          url: '/',
          themeId: 'luxury',
          theme: 'Luxury Hotels',
        },
        {
          id: 'l2',
          title: 'Kashmir Luxury Houseboat',
          description: 'Stay in luxurious houseboats on Dal Lake with personalized service.',
          url: '/',
          themeId: 'luxury',
          theme: 'Luxury Hotels',
        },
        {
          id: 'l3',
          title: 'Goa Beach Resort Package',
          description: 'Enjoy 5-star beach resorts with private beaches in Goa.',
          url: '/',
          themeId: 'luxury',
          theme: 'Luxury Hotels',
        },
      ];
    case 'culture':
      return [
        {
          id: 'c1',
          title: 'Heritage Walk Varanasi',
          description: 'Explore the ancient streets and ghats of Varanasi with expert guides.',
          url: '/',
          themeId: 'culture',
          theme: 'Cultural Tours',
        },
        {
          id: 'c2',
          title: 'South India Temple Tour',
          description: 'Visit magnificent temples in Tamil Nadu and Kerala with cultural insights.',
          url: '/',
          themeId: 'culture',
          theme: 'Cultural Tours',
        },
        {
          id: 'c3',
          title: 'Buddhist Circuit Tour',
          description:
            'Follow the footsteps of Buddha through significant Buddhist sites in India.',
          url: '/',
          themeId: 'culture',
          theme: 'Cultural Tours',
        },
      ];
    default:
      return [
        {
          id: 'd1',
          title: 'Delhi City Tour',
          description: 'Explore the capital city with its blend of old and new attractions.',
          url: '/',
          themeId: 'default',
          theme: 'Popular Tours',
        },
        {
          id: 'd2',
          title: 'Agra Taj Mahal Tour',
          description: 'Visit the iconic symbol of love, the Taj Mahal, with expert guides.',
          url: '/',
          themeId: 'default',
          theme: 'Popular Tours',
        },
        {
          id: 'd3',
          title: 'Jaipur Pink City Tour',
          description: 'Discover the pink city with its majestic forts and vibrant markets.',
          url: '/',
          themeId: 'default',
          theme: 'Popular Tours',
        },
      ];
  }
};

// Fallback theme groups
const getFallbackThemeGroups = (): ThemeGroup[] => [
  {
    id: 'winter',
    name: 'Winter Tours',
    tours: getFallbackTours('winter'),
  },
  {
    id: 'summer',
    name: 'Summer Holiday',
    tours: getFallbackTours('summer'),
  },
  {
    id: 'luxury',
    name: 'Luxury Hotels',
    tours: getFallbackTours('luxury'),
  },
  {
    id: 'culture',
    name: 'Cultural Tours',
    tours: getFallbackTours('culture'),
  },
];
