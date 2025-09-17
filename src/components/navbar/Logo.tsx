'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import WTIndiaLogo from '@/app/../../public/assets/images/logo1.png';

const Logo: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex-shrink-0">
      <Image
        src={WTIndiaLogo}
        width={200}
        height={60}
        alt="Way to India Logo"
        onClick={() => router.push('/')}
        className="cursor-pointer w-32 h-auto sm:w-40 md:w-48 lg:w-52 xl:w-56 transition-all duration-200"
        priority
      />
    </div>
  );
};

export default Logo;
