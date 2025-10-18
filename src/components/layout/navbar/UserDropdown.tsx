'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { CaretDown, User as UserIcon } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const UserDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleLogoutClick = () => {
    setDropdownOpen(false);
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const menuItems = [
    {
      label: 'Profile',
      action: () => router.push('/profile'),
      isDestructive: false,
    },
    {
      label: 'My Bookings',
      action: () => router.push('/my-bookings'),
      isDestructive: false,
    },
    {
      label: 'Logout',
      action: handleLogoutClick,
      isDestructive: true,
    },
  ];

  const modalContent = showLogoutConfirm ? (
    <div
      className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center p-4 transition-all duration-300 ease-out"
      style={{
        zIndex: 99999,
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      <style jsx>{`
        @keyframes fadeIn {
          from {
            background-color: rgba(0, 0, 0, 0);
          }
          to {
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl"
        style={{
          animation: 'slideUp 0.3s ease-out forwards',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 rounded-full p-3">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3
              className="text-lg font-semibold text-gray-900"
              style={{ fontFamily: theme.typography.fontFamily.bold }}
            >
              Confirm Logout
            </h3>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: theme.typography.fontFamily.regular }}
            >
              Are you sure you want to logout?
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCancelLogout}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging out...
              </>
            ) : (
              'Yes, Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className="relative hidden lg:block" ref={dropdownRef}>
        <button
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 hover:bg-orange-50 ${
            dropdownOpen ? 'bg-orange-50' : ''
          }`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-orange-300 bg-orange-50 flex items-center justify-center flex-shrink-0">
            <UserIcon size={20} weight="fill" className="text-orange-500" />
          </div>
          <span
            className="hidden sm:block font-medium text-gray-700 max-w-24 truncate"
            style={{ fontFamily: theme.typography.fontFamily.regular }}
          >
            {user?.firstName || 'User'}
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
                  if (!item.isDestructive) {
                    setDropdownOpen(false);
                  }
                }}
                style={{ fontFamily: theme.typography.fontFamily.regular }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal - Rendered using Portal */}
      {mounted &&
        typeof document !== 'undefined' &&
        modalContent &&
        createPortal(modalContent, document.body)}
    </>
  );
};

export default UserDropdown;
