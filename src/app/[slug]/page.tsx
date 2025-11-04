import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMetaData, getAllTourSlugs } from '@/lib/tourMetaData';
import TourDetails from './TourDetails';

type Props = {
  params: { slug: string };
};

async function getTourFAQSchema(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://waytoindia.shop';

    const res = await fetch(`${apiUrl}/api/faq/${slug}/schema`, {
      next: { revalidate: 86400 },
      cache: 'force-cache',
    });

    if (!res.ok) {
      console.warn(`⚠️ FAQ schema not available for ${slug}: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    return data?.payload || null;
  } catch (error) {
    console.warn(`⚠️ Error fetching FAQ schema for ${slug}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const slugs = getAllTourSlugs();

  const validSlugs = slugs.filter(slug => {
    const metaInfo = getMetaData(slug);
    return metaInfo !== null;
  });

  console.log(`✅ Generating ${validSlugs.length} static tour pages`);

  return validSlugs.map(slug => ({
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

  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.waytoindia.com';

  const canonicalUrl = `${frontendUrl}/${params.slug}`;

  return {
    title: metaInfo.title,
    description: metaInfo.description,
    keywords: metaInfo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metaInfo.title,
      description: metaInfo.description,
      type: 'website',
      locale: 'en_US',
      url: canonicalUrl,
      siteName: 'Way to India',
      images: [
        {
          url: `${frontendUrl}/images/tours/${params.slug}-og.jpg`,
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
      images: [`${frontendUrl}/images/tours/${params.slug}-twitter.jpg`],
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