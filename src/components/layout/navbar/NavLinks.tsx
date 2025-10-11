'use client';
import { useRouter, usePathname } from 'next/navigation';
import { House, UsersFour, Bed, Island, Headset } from '@phosphor-icons/react';
import NavItem from './NavItem';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { icon: House, text: 'Home', path: '/' },
  { icon: UsersFour, text: 'Tours', path: '/tours' },
  { icon: Bed, text: 'Hotels', path: '/hotels' },
  { icon: Island, text: 'Transportation', path: '/transport' },
  { icon: Headset, text: 'Contact Us', path: '/contact-us' },
];

const NavLinks: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  const normalizedPath = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname;

  return (
    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
      {navItems.map((item, index) => {
        const isActive =
          item.path === '/' ? normalizedPath === '/' : normalizedPath?.startsWith(item.path);

        return (
          <NavItem
            key={index}
            {...item}
            onClick={() => router.push(item.path)}
            active={isActive} 
          />
        );
      })}
    </div>
  );
};

export default NavLinks;
