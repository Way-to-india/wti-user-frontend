'use client';

import { useState, useRef, useEffect } from 'react';
import { List, X, User, House, UsersFour, Bed, Island, Headset } from '@phosphor-icons/react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import NavItem from './NavItem';
import Image from 'next/image';

const navItems = [
  { icon: House, text: 'Home', path: '/' },
  { icon: UsersFour, text: 'Tours', path: '/tours' },
  { icon: Bed, text: 'Hotels', path: '/hotels' },
  { icon: Island, text: 'Transportation', path: '/transport' },
  { icon: Headset, text: 'Contact Us', path: '/contact-us' },
];

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { user, token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const normalizedPath = pathname?.endsWith('/') ? pathname.slice(0, -1) : pathname;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      setIsVisible(true);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const openMenu = () => setIsOpen(true);

  const closeMenu = () => {
    setIsOpen(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleNavigation = (path: string) => {
    if (!path) return;
    console.log('Navigating to:', path);
    router.push(path);
    closeMenu();
  };

  const handleLogout = () => {
    logoutUser();
    closeMenu();
    router.push('/auth/signup');
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={isOpen ? closeMenu : openMenu}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
        aria-label="Toggle mobile menu"
      >
        <div className="w-6 h-6 flex items-center justify-center">
          <div className="relative w-5 h-4">
            <span
              className={`absolute left-0 w-full h-0.5 bg-gray-700 transition-all duration-300 ${
                isOpen ? 'top-2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-2 w-full h-0.5 bg-gray-700 transition-all duration-300 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 w-full h-0.5 bg-gray-700 transition-all duration-300 ${
                isOpen ? 'top-2 -rotate-45' : 'top-4'
              }`}
            />
          </div>
        </div>
      </button>

      {isVisible && (
        <>
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-40 ${
              isOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeMenu}
          />

          <div
            ref={menuRef}
            className={`fixed top-0 right-0 h-screen w-80 max-w-[85vw] 
              bg-white shadow-2xl z-[9999] transform 
              transition-transform duration-300 ease-out
              ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-orange-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <List size={18} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {token && user && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-orange-200 bg-orange-50">
                        {user.profileImagePath ? (
                          <Image
                            src={user.profileImagePath}
                            alt="Profile"
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User size={24} className="text-orange-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg truncate">
                          {user.name || 'User'}
                        </h3>
                        {user.email && (
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Navigation
                  </h3>
                  <div className="space-y-1">
                    {navItems.map((item, index) => {
                      const isActive =
                        item.path === '/'
                          ? normalizedPath === '/'
                          : normalizedPath?.startsWith(item.path);

                      return (
                        <div
                          key={index}
                          style={{
                            transition: 'all 0.3s ease',
                            transitionDelay: `${index * 60}ms`,
                            transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
                            opacity: isOpen ? 1 : 0,
                          }}
                        >
                          <NavItem
                            {...item}
                            onClick={() => handleNavigation(item.path)}
                            active={isActive}
                            isMobile={true}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Account
                  </h3>
                  {token ? (
                    <div className="space-y-1">
                      <button
                        onClick={() => handleNavigation('/profile')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-blue-50 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-blue-700">
                          Profile
                        </span>
                      </button>

                      <button
                        onClick={() => handleNavigation('/my-bookings')}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-green-50 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <Bed size={16} className="text-green-600" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-green-700">
                          My Bookings
                        </span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl hover:bg-red-50 transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <X size={16} className="text-red-600" />
                        </div>
                        <span className="font-medium text-gray-700 group-hover:text-red-700">
                          Logout
                        </span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavigation('/auth')}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      Sign Up / Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MobileMenu;
