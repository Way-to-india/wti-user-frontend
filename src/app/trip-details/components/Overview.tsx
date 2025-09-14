// components/details-page/Overview.tsx
import Star from '@/assets/icons/Star.png';
import { Clock, HandPeace, Heart, IconProps, MapPin } from '@phosphor-icons/react';
import Image from 'next/image';
import React from 'react';

//interface for details section in overviewInterface
interface Detail {
  icon: string;
  title: string;
  value: string;
}

interface overviewInterface {
  destination: string;
  category: string;
  rating: number;
  details: Detail[];
  description: string;
}

const Overview: React.FC<{ placeHolder: overviewInterface }> = ({ placeHolder }) => {
  // const [overviewData, setOverviewData] = useState(null);

  // Fetch details
  // useEffect(() => {
  //     const fetchData = async () => {
  //         const response = await fetch('/api/tourist-destination');  // Mock API endpoint
  //         const data = await response.json();
  //         setOverviewData(data);
  //     };

  //     fetchData();
  // }, []);

  // Map the icon name to the actual component
  const IconMap: { [key: string]: React.ComponentType<IconProps> } = {
    Clock: Clock,
    MapPin: MapPin,
    Heart: Heart,
    HandPeace: HandPeace,
  };

  const list = [];
  let index = 0;
  for (const category of placeHolder.category) {
    list.push(
      <div key={index++ + 1000} className="px-1">
        <div className="rounded-xl px-2 border-2 border-carrot-orange ">
          <div className="text-carrot-orange  text-md font-[500]">{category}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full ml-4 px-4">
      <div className="w-full inline-flex justify-between">
        <h1 className="text-4xl font-bold text-carrot-orange mb-2">{placeHolder.destination}</h1>
        {/* <Button
                    style={{
                        backgroundColor: '#FF8B02',
                        borderRadius: '25%',
                    }}
                >
                    <Image src={Export} alt={'Export'} width={32} height={32} />
                </Button> */}
      </div>

      <div className="flex flex-wrap items-center my-4">
        {/** to control if there is a label section on different pages */}
        {list}

        <Image src={Star} alt={'Star Icon'} width={20} height={20} className="ml-4" />
        <span className="ml-1 text-gray-700">{placeHolder.rating} Ratings</span>
      </div>

      {/* Overview details */}
      <h2 className="text-heavy-metal text-2xl font-bold">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-4">
        {placeHolder.details.map((detail, index) => {
          const IconComponent = IconMap[detail.icon];

          return (
            <div key={index} className="rounded-xl border-2 border-[#BABABA]">
              <div className="px-4 py-3">
                <span className="block text-gray-700 items-center">
                  <IconComponent size={28} className="mr-2" />
                  {detail.title}
                </span>
                <span className="block text-lg font-semibold">{detail.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Description Section */}
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-800">Description</h2>
        <p className="text-heavy-metal mt-2 pr-8">
          {placeHolder.description}
          {/* <span className="text-carrot-orange cursor-pointer"> Read more</span> */}
        </p>
      </div>
    </div>
  );
};

export default Overview;
