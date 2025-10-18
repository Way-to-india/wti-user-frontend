'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  House,
  UsersFour,
  Bed,
  Island,
  Headset,  
  MapTrifold,
  CaretDown,
} from '@phosphor-icons/react';
import NavItem from './NavItem';
import { useTheme } from '@/context/ThemeContext';

const navItems = [
  { icon: House, text: 'Home', path: '/' },
  { icon: UsersFour, text: 'Tours', path: '/tours' },
  { icon: Bed, text: 'Hotels', path: '/hotels' },
  { icon: Headset, text: 'Contact Us', path: '/contact-us' },
  { icon: Island, text: 'Transportation', path: '/transport' },
];

const travelGuideItems = [
  { text: 'Destination Guide', path: '/travel-guide/destination-guide' },
  { text: 'Places of Tourist Interest', path: '/travel-guide/places-of-interest' },
  { text: 'Travel Tips', path: '/travel-guide/travel-tips' },
  { text: 'Travel Toolkit', path: '/travel-guide/travel-toolkit' },
];

const NavLinks: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedPath = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname;

  const isTravelGuideActive = normalizedPath?.startsWith('/travel-guide');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
      {navItems.map((item, index) => {
        const isActive =
          item.path === '/' ? normalizedPath === '/' : normalizedPath?.startsWith(item.path);

        return (
          <NavItem key={index} {...item} onClick={() => router.push(item.path)} active={isActive} />
        );
      })}

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200`}
          style={{ fontFamily: theme.typography.fontFamily.regular }}
        >
          <MapTrifold size={20} weight={isTravelGuideActive ? 'fill' : 'regular'} />
          <span className="font-medium">Travel Guide</span>
          <CaretDown
            size={14}
            className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 animate-slideDown">
            <style jsx>{`
              @keyframes slideDown {
                from {
                  opacity: 0;
                  transform: translateY(-10px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-slideDown {
                animation: slideDown 0.2s ease-out forwards;
              }
            `}</style>
            {travelGuideItems.map((item, index) => {
              const isActive = normalizedPath === item.path;
              return (
                <button
                  key={index}
                  onClick={() => {
                    router.push(item.path);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                    isActive
                      ? 'bg-orange-50 text-orange-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  style={{ fontFamily: theme.typography.fontFamily.regular }}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
