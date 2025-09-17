'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CaretDown, User as UserIcon } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const UserDropdown: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const menuItems = [
    { label: 'Profile', action: () => router.push('/profile') },
    { label: 'My Bookings', action: () => router.push('/my-bookings') },
    { label: 'Logout', action: logoutUser, isDestructive: true },
  ];

  return (
    <div className="relative hidden lg:block" ref={dropdownRef}>
      <button
        className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-orange-50 ${
          dropdownOpen ? 'bg-orange-50' : ''
        }`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-orange-300 bg-orange-50 flex items-center justify-center flex-shrink-0">
          {user?.profileImagePath ? (
            <Image
              src={user.profileImagePath}
              alt="Profile"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon size={20} weight="fill" className="text-orange-500" />
          )}
        </div>
        <span
          className="hidden sm:block font-medium text-gray-700 max-w-24 truncate"
          style={{ fontFamily: theme.typography.fontFamily.regular }}
        >
          {user?.name || 'User'}
        </span>
        <CaretDown
          size={14}
          className={`hidden sm:block transition-transform duration-200 text-gray-500 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                item.isDestructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'
              }`}
              onClick={() => {
                item.action();
                setDropdownOpen(false);
              }}
              style={{ fontFamily: theme.typography.fontFamily.regular }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
