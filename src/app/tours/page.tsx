import { Metadata } from 'next';
import ToursPageContent from './TourPageContent';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export const metadata: Metadata = {
  title: 'All India Tour Packages 2025 | Way to India',
  description:
    'Explore our comprehensive collection of India tour packages. Discover Taj Mahal tours, Rajasthan heritage tours, Kerala backwaters, Golden Triangle, and more. Best prices and expert guides.',
  keywords:
    'india tours, tour packages india, india travel packages, taj mahal tour, rajasthan tour, kerala tour, golden triangle tour, india vacation packages, heritage tours',

  alternates: {
    canonical: 'https://waytoindia.com/tours',
  },

  openGraph: {
    title: 'All India Tour Packages 2024 | Way to India',
    description:
      'Explore our comprehensive collection of India tour packages with expert guides and best prices.',
    type: 'website',
    locale: 'en_US',
    url: 'https://waytoindia.com/tours',
    siteName: 'Way to India',
    images: [
      {
        url: 'https://waytoindia.com/images/tours-listing-og.jpg',
        width: 1200,
        height: 630,
        alt: 'India Tour Packages',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'All India Tour Packages 2024 | Way to India',
    description: 'Explore our comprehensive collection of India tour packages',
    images: ['https://waytoindia.com/images/tours-listing-twitter.jpg'],
    creator: '@waytoindia',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function TourPage({ params, searchParams }: Props) {
  return <ToursPageContent slug={params.slug} searchParams={searchParams} />;
}
