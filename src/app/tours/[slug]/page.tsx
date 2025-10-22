import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetaData, getAllTourSlugs } from '@/lib/tourMetaData';
import TourDetails from './TourDetails';

type Props = {
  params: { slug: string };
};

async function getTourFAQSchema(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const res = await fetch(`${apiUrl}/api/faq/${slug}/schema`, {
      cache: 'force-cache',
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    return data?.payload || null;
  } catch (error) {
    console.error(`Error fetching FAQ schema for ${slug}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = getAllTourSlugs();
  return slugs.map(slug => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metaInfo = getMetaData(params.slug);
  if (!metaInfo) {
    console.warn(`⚠️ No metadata found for tour: ${params.slug}`);
    return {
      title: 'Tour Not Found | Way to India',
      description: 'This tour could not be found.',
    };
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://waytoindia.com';
  return {
    title: metaInfo.title,
    description: metaInfo.description,
    keywords: metaInfo.keywords,
    alternates: {
      canonical: `${baseUrl}${metaInfo.canonicalPath}`,
    },
    openGraph: {
      title: metaInfo.title,
      description: metaInfo.description,
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}${metaInfo.canonicalPath}`,
      siteName: 'Way to India',
      images: [
        {
          url: `${baseUrl}/images/tours/${params.slug}-og.jpg`,
          width: 1200,
          height: 630,
          alt: metaInfo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaInfo.title,
      description: metaInfo.description,
      images: [`${baseUrl}/images/tours/${params.slug}-twitter.jpg`],
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
}

export default async function TourDetailPage({ params }: Props) {
  const metaInfo = getMetaData(params.slug);

  if (!metaInfo) {
    notFound();
  }

  const faqData = await getTourFAQSchema(params.slug);

  return (
    <>
      {faqData?.faqSchema && (
        <script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqData.faqSchema),
          }}
        />
      )}

      <TourDetails params={{ id: params.slug }} />
    </>
  );
}