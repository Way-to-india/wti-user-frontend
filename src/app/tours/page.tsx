import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetaData, getAllTourSlugs } from '@/lib/tourMetaData';
import ToursPageContent from './TourPageContent';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateStaticParams() {
  const slugs = getAllTourSlugs();

  return slugs.map(slug => ({
    slug: slug,
  }));
}

// Generate metadata for SEO (Server-side)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metaInfo = getMetaData(params.slug);
  const baseUrl = 'https://waytoindia.com'; // Replace with your actual domain

  return {
    title: metaInfo.title,
    description: metaInfo.description,
    keywords: metaInfo.keywords,

    // Canonical URL (Very important for SEO)
    alternates: {
      canonical: `${baseUrl}${metaInfo.canonicalPath}`,
    },

    // Open Graph for Facebook, LinkedIn
    openGraph: {
      title: metaInfo.title,
      description: metaInfo.description,
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}${metaInfo.canonicalPath}`,
      siteName: 'Waytoindia.com',
      images: [
        {
          url: `${baseUrl}/images/tours/${params.slug}-og.jpg`, // Add tour images
          width: 1200,
          height: 630,
          alt: metaInfo.title,
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: metaInfo.title,
      description: metaInfo.description,
      images: [`${baseUrl}/images/tours/${params.slug}-twitter.jpg`],
      creator: '@waytoindia', // Your Twitter handle
    },

    // Robots meta tag
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

    // Verification (Add your verification codes)
    verification: {
      google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // bing: 'your-bing-verification-code',
    },
  };
}

export default function TourPage({ params, searchParams }: Props) {
  // Validate slug exists
  const metaInfo = getMetaData(params.slug);

  // Return 404 if tour not found (optional)
  // if (!tourMetaData[params.slug]) {
  //   notFound();
  // }

  return <ToursPageContent slug={params.slug} searchParams={searchParams} />;
}
