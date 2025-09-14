import axios from '@/api/axios';
import endpoints from '@/api/endpoints';
import { handleApiCall } from '@/utils/apiHandler';
import { ApiResponse } from '@/types/apiResponse';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image?: string;
  author?: string;
  publishDate?: string;
  slug?: string;
  isFeatured?: boolean;
}

// Function to get blog posts
export const getBlogPosts = async (limit: number = 5): Promise<ApiResponse<BlogPost[]>> => {
  try {
    const response = await handleApiCall(
      async () => axios.get(`${endpoints.blog?.getAll || '/api/blog'}?limit=${limit}`), 
      "Blog posts fetched successfully"
    );

    if (response.success && response.data) {
      return response;
    }

    // If no data from API or API doesn't exist yet, return fallback data
    return {
      success: true,
      message: "Using fallback blog data",
      data: getFallbackBlogPosts()
    };
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    
    // Return fallback data in case of error
    return {
      success: true,
      message: "Using fallback blog data due to error",
      data: getFallbackBlogPosts()
    };
  }
};

// Function to get a featured blog post
export const getFeaturedBlogPost = async (): Promise<ApiResponse<BlogPost>> => {
  try {
    const response = await handleApiCall(
      async () => axios.get(`${endpoints.blog?.getFeatured || '/api/blog/featured'}`), 
      "Featured blog post fetched successfully"
    );

    if (response.success && response.data) {
      return {
        ...response,
        data: response.data as BlogPost
      };
    }

    // Try getting all posts and finding a featured one
    const allPosts = await getBlogPosts();
    if (allPosts.success && allPosts.data && allPosts.data.length > 0) {
      // Find a featured post or use the first one
      const featuredPost = allPosts.data.find(post => post.isFeatured) || allPosts.data[0];
      return {
        success: true,
        message: "Featured blog post fetched from all posts",
        data: featuredPost
      };
    }

    // If no data from API, return fallback data
    return {
      success: true,
      message: "Using fallback featured blog post data",
      data: getFallbackBlogPosts()[0]
    };
  } catch (error) {
    console.error("Error fetching featured blog post:", error);
    
    // Return fallback data in case of error
    return {
      success: true,
      message: "Using fallback featured blog post data due to error",
      data: getFallbackBlogPosts()[0]
    };
  }
};

// Fallback blog posts data
const getFallbackBlogPosts = (): BlogPost[] => [
  {
    id: "1",
    title: "Rishikesh – Enjoy the Perfect Concoction of Spirituality and Adventure",
    excerpt: "A small town so lovingly pampered by the Mother Nature and sanctified by the spiritual environment, Rishikesh has no small designations to its credit. Popular as 'the Gateway to Himalayas', 'the adventure Mecca of North India' and 'World's Yoga Capital', it welcomes the flocks of tourists starting from October of this month............",
    image: "/assets/images/destination.png",
    author: "Travel Team",
    publishDate: "2025-05-15",
    slug: "rishikesh-spirituality-adventure",
    isFeatured: true
  },
  {
    id: "2",
    title: "Ever Visited a Fairytale Town? Make it Possible with Udaipur",
    excerpt: "Known as the City of Lakes, Udaipur is one of India's most romantic destinations with its beautiful lakes, palaces, and gardens.",
    publishDate: "2025-05-10",
    slug: "udaipur-fairytale-town"
  },
  {
    id: "3",
    title: "Rann Utsav – Mosaic of Cultural Vibrancy on White Salt Desert",
    excerpt: "Experience the unique cultural festival that takes place on the vast white salt desert of Kutch, Gujarat.",
    publishDate: "2025-05-05",
    slug: "rann-utsav-cultural-festival"
  },
  {
    id: "4",
    title: "Corbett National Park – Experience the Thrill in Chilly Weather",
    excerpt: "Discover the beauty of India's oldest national park and experience incredible wildlife sightings in the winter months.",
    publishDate: "2025-04-28",
    slug: "corbett-national-park-wildlife"
  },
  {
    id: "5",
    title: "Jaipur Literature Festival – Enjoy the Company of the Best Storytellers",
    excerpt: "Explore the world's largest free literary festival that brings together the greatest writers, thinkers, and storytellers.",
    publishDate: "2025-04-20",
    slug: "jaipur-literature-festival"
  }
];
