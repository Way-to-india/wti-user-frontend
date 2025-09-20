import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import BlogListItem from './BlogListItem';
import BlogImage from '@/assets/images/destination.png';
import { getBlogPosts, getFeaturedBlogPost, BlogPost } from '@/services/blogService';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';

const BlogSection = () => {
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchBlogData();
  }, []);

  const fetchBlogData = async () => {
    try {
      setIsLoading(true);

      // Fetch featured post
      const featuredResponse = await getFeaturedBlogPost();
      if (featuredResponse.success && featuredResponse.data) {
        setFeaturedPost(featuredResponse.data);
      }

      // Fetch blog posts list
      const postsResponse = await getBlogPosts(4); // Get up to 4 posts for the list
      if (postsResponse.success && postsResponse.data) {
        // Filter out the featured post if it's in the list
        const filteredPosts =
          featuredResponse.data && featuredResponse.data.id
            ? postsResponse.data.filter(post => post.id !== featuredResponse.data!.id)
            : postsResponse.data;

        setBlogPosts(filteredPosts.slice(0, 4)); // Ensure we only show 4 posts max
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadMore = (slug?: string) => {
    if (slug) {
      router.push(`/blog/${slug}`);
    } else {
      router.push('/blog');
    }
  };

  return (
    <section className="container mx-auto my-12 md:my-16 px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold text-carrot-orange mb-6 text-center md:text-left">
        Latest WaytoIndia Travel Blogs
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <CircularProgress sx={{ color: '#FF8B02' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blog Highlight - Left Side */}
          {featuredPost && (
            <div className="relative">
              {' '}
              <div className="relative h-64 md:h-80">
                {featuredPost.image ? (
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <Image
                    src={BlogImage}
                    alt={featuredPost.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
                <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-60 text-white rounded-b-lg w-full">
                  <h3 className="text-lg font-bold">Travel Destination of the Month</h3>
                </div>
              </div>
              {/* Text Below Image */}
              <div className="p-4 bg-white shadow-sm rounded-b-lg">
                <p className="font-semibold text-lg">{featuredPost.title}</p>
                <p className="text-sm mt-2 text-gray-700">
                  {featuredPost.excerpt}
                  <a
                    className="text-orange-400 ml-1 font-semibold cursor-pointer hover:underline"
                    onClick={() => handleReadMore(featuredPost.slug)}
                  >
                    Read more
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Blog List - Right Side */}
          <div className="flex flex-col justify-between h-full px-0 sm:px-4 md:px-8">
            <div className="space-y-4 md:space-y-6 flex-grow h-full flex flex-col">
              {blogPosts.map(post => (
                <BlogListItem
                  key={post.id}
                  title={post.title}
                  date={post.publishDate}
                  onClick={() => handleReadMore(post.slug)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
