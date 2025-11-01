import React from 'react';
import DynamicListingPage from '../common/DynamicListingPage';
import ToursSearchSection from './TourSearchSection';
import ToursGrid from './TourGrid';

type ToursLayoutProps = {
    tours: any[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalItems: number;
    themes: any[];
    selectedTheme: string | null;
    cities: any[];
    selectedCity: string | null;
    selectedDuration: number | null;
    selectedPriceRange: [number, number];
    isSearching: boolean;
    isFiltering: boolean;
    retryCount: number;
    isRetrying: boolean;
    onSearch: (params: any) => void;
    onFilterChange: (filters: any) => void;
    onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
};

const ToursLayout: React.FC<ToursLayoutProps> = ({
    tours,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    themes,
    selectedTheme,
    cities,
    selectedCity,
    selectedDuration,
    selectedPriceRange,
    isSearching,
    isFiltering,
    retryCount,
    isRetrying,
    onSearch,
    onFilterChange,
    onPageChange,
}) => {
    const filterOptions = {
        themes: themes.map(theme => ({ id: theme.id, label: theme.label })),
        destinations: cities.map(city => ({ id: city.id, label: city.label })),
        durations: [
            { id: '3', label: 'Short (1-3 Days)' },
            { id: '7', label: 'Medium (4-7 Days)' },
            { id: '14', label: 'Long (8-14 Days)' },
            { id: '15', label: 'Extended (15+ Days)' },
        ],
        priceRange: { min: 3000, max: 60000 },
    };

    const initialFilterState = {
        selectedThemes: selectedTheme ? [selectedTheme] : [],
        selectedDestinations: selectedCity ? [selectedCity] : [],
        selectedDurations: selectedDuration ? [selectedDuration.toString()] : [],
        priceRange: selectedPriceRange,
    };

    const breadcrumbs = [
        { href: '/', text: 'Home' },
        { href: '/tours', text: 'Tours' },
    ];

    return (
        <DynamicListingPage
            type="tour"
            title="Find Your Perfect Tour"
            searchComponent={
                <ToursSearchSection
                    cities={cities}
                    themes={themes}
                    selectedCity={selectedCity}
                    selectedTheme={selectedTheme}
                    onSearch={onSearch}
                />
            }
            totalItems={totalItems}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
            initialFilterState={initialFilterState}
            breadcrumbs={breadcrumbs}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            loading={loading}
            isSearching={isSearching}
            isFiltering={isFiltering}
            error={error || undefined}
            retryCount={retryCount}
            isRetrying={isRetrying}
        >
            <ToursGrid tours={tours} />
        </DynamicListingPage>
    );
};

export default ToursLayout;