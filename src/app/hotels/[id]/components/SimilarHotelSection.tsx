import Link from 'next/link';
import { FiMapPin, FiStar } from 'react-icons/fi';
import { SimilarHotel, City } from '@/types/hotel';
import placeholderImage from '@/assets/images/destination.png';
import Image from 'next/image';

interface SimilarHotelsSectionProps {
  similarHotels: SimilarHotel[];
  cityDetails: City | null;
}

export const SimilarHotelsSection: React.FC<SimilarHotelsSectionProps> = ({
  similarHotels,
  cityDetails,
}) => {
  return (
    <div className="mt-12 pb-8 border-t border-gray-200 pt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Hotels</h2>

      {/* Search bar and navigation controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-xs">
          <input
            type="text"
            placeholder="Search for a hotel"
            className="w-full p-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF8B02]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous">
            <svg className="w-6 h-6 text-[#FF8B02]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a 1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Next">
            <svg className="w-6 h-6 text-[#FF8B02]" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a 1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Hotel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto pb-4">
        {similarHotels && similarHotels.length > 0 ? (
          similarHotels.map(hotel => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 flex flex-col"
            >
              <div className="relative h-48">
                <Image
                  src={hotel.imageUrls?.[0] || placeholderImage.src}
                  alt={hotel.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{hotel.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">
                    {hotel.category || '4 Star'}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs flex items-center">
                    <FiMapPin size={10} className="mr-1" />
                    {cityDetails?.city_name || 'Rishikesh'}
                  </span>
                </div>

                <div className="flex items-center mb-2">
                  <div className="flex text-[#FF8B02]">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < (hotel.userRating || 4.5) ? 'text-[#FF8B02]' : 'text-gray-300'
                          }
                          size={14}
                        />
                      ))}
                  </div>
                  <span className="text-xs ml-1 text-gray-600">
                    {hotel.userRating || 4.5} Ratings
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">3 room types</p>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                  Enjoy a peaceful night's sleep in a well-appointed space featuring modern
                  amenities.
                </p>

                <div className="flex justify-between items-center mt-auto">
                  <div>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-[#FF8B02] font-semibold">₹{hotel.price || 2500} per night</p>
                  </div>
                  <Link href={`/hotels/${hotel.id}`}>
                    <span className="inline-block bg-[#FF8B02] text-white px-4 py-2 rounded hover:bg-[#e67f00] text-sm">
                      View Rooms
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center p-8 bg-gray-50 rounded-lg">
            <p>No similar hotels found</p>
          </div>
        )}
      </div>
    </div>
  );
};
