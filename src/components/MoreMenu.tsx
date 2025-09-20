import { CaretDown } from '@phosphor-icons/react';
import React, { useState } from 'react';

const MoreMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = ['About Us', 'Theme', 'Travel Guide', 'Careers', 'Contact Us'];

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full font-lexend text-sm font-sm text-gray-700"
          onClick={toggleMenu}
        >
          More
          <CaretDown
            size={32}
            className={`ml-1 w-4 h-4 transform transition-transform ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-auto rounded-md shadow-lg bg-carrot-orange ring-1 ring-black ring-opacity-5 whitespace-nowrap z-10">
          <div className="py-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-500 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
