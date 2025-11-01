import React from 'react';
import DynamicSearchTab from '../common/DynamicSearchTab';

type ToursSearchSectionProps = {
    cities: any[];
    themes: any[];
    selectedCity: string | null;
    selectedTheme: string | null;
    onSearch: (params: any) => void;
};

const ToursSearchSection: React.FC<ToursSearchSectionProps> = ({
    cities,
    themes,
    selectedCity,
    selectedTheme,
    onSearch,
}) => {
    const locationOptions = cities.map(city => ({ id: city.id, label: city.label }));
    const themeOptions = themes.map(theme => ({ id: theme.id, label: theme.label }));

    const selectedLocationObj = selectedCity
        ? locationOptions.find(city => city.id === selectedCity) || null
        : null;

    return (
        <DynamicSearchTab
            type="tour"
            locations={locationOptions}
            selectedLocation={selectedLocationObj}
            onSearch={onSearch}
            typesOptions={themeOptions}
            selectedType={selectedTheme || ''}
            typeLabel="Tour Theme"
            dateRangeLabel="Travel Dates"
        />
    );
};

export default ToursSearchSection;