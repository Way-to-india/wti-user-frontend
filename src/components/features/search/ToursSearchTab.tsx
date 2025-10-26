"use client";
import { RootState, AppDispatch } from '@/app/redux/store';
import { MapPin, Calendar, Users, Tag, ChevronDown } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchCities, fetchThemes } from '@/app/redux/toursSlice';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { id: string; label: string }[];
  placeholder: string;
  icon: React.ReactNode;
  label: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === value);
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3.5 pr-11 border-2 border-gray-200 rounded-xl bg-white text-left text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none cursor-pointer hover:border-orange-400 hover:shadow-md font-medium flex items-center justify-between"
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
              }`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute bottom-full left-0 right-0 mb-2 bg-white border-2 border-orange-200 rounded-xl shadow-2xl z-50 overflow-hidden"
            style={{
              maxHeight: '320px',
              animation: 'slideUp 0.2s ease-out',
            }}
          >
            {/* Search Input */}
            <div className="sticky top-0 bg-white border-b-2 border-orange-100 p-3">
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none"
                onClick={e => e.stopPropagation()}
              />
            </div>

            {/* Options List */}
            <div className="overflow-y-auto" style={{ maxHeight: '260px' }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      onChange(option.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-4 py-3 text-left transition-all duration-150 border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 hover:pl-6 ${value === option.id
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold border-l-4 border-l-orange-600'
                        : 'text-gray-700 hover:text-orange-600'
                      }`}
                  >
                    {option.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  No results found
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Custom Scrollbar */
        div::-webkit-scrollbar {
          width: 8px;
        }

        div::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          border-radius: 4px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
        }
      `}</style>
    </div>
  );
};

const HomeTourSearchTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { themes, cities } = useSelector((state: RootState) => state.tours);

  const [formData, setFormData] = useState({
    destination: '',
    theme: '',
    startDate: '',
    endDate: '',
    guests: '2',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchThemes()).unwrap(),
          dispatch(fetchCities()).unwrap(),
        ]);
      } catch (error) {
        console.error('Failed to fetch cities and themes:', error);
      }
    };

    if (cities.length === 0 || themes.length === 0) {
      fetchData();
    }
  }, [dispatch, cities.length, themes.length]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();

    if (formData.destination) {
      params.set('cityId', formData.destination);
    }

    if (formData.theme) {
      params.set('themeId', formData.theme);
    }

    if (formData.startDate && formData.endDate) {
      params.set('startDate', formData.startDate);
      params.set('endDate', formData.endDate);

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      params.set('duration', duration.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `/tours?${queryString}` : '/tours';

    router.push(url);
  };

  const cityOptions = cities.map(city => ({ id: city.id, label: city.label }));
  const themeOptions = themes.map(theme => ({ id: theme.id, label: theme.label }));
  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => ({
    id: num.toString(),
    label: `${num} Guest${num !== 1 ? 's' : ''}`,
  }));

  return (
    <div>
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Destination */}
          <CustomSelect
            value={formData.destination}
            onChange={value => handleCustomSelectChange('destination', value)}
            options={cityOptions}
            placeholder="Select destination..."
            icon={<MapPin className="w-4 h-4 text-orange-500" />}
            label="Destination"
          />

          {/* Tour Theme */}
          <CustomSelect
            value={formData.theme}
            onChange={value => handleCustomSelectChange('theme', value)}
            options={themeOptions}
            placeholder="Any theme..."
            icon={<Tag className="w-4 h-4 text-orange-500" />}
            label="Tour Theme"
          />

          {/* Travel Start Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Travel Start
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-medium"
            />
          </div>

          {/* Travel End Date */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-orange-500" />
              Travel End
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none font-medium"
            />
          </div>

          {/* Guests */}
          <CustomSelect
            value={formData.guests}
            onChange={value => handleCustomSelectChange('guests', value)}
            options={guestOptions}
            placeholder="Select guests..."
            icon={<Users className="w-4 h-4 text-orange-500" />}
            label="Guests"
          />

          {/* Search Button */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? 'Searching...' : 'Search Tours'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HomeTourSearchTab;