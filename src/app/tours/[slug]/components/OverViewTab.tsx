import React from 'react';

interface TourOverviewProps {
  name?: string;
  overview?: string;
  title?: string;
}

const TourOverview: React.FC<TourOverviewProps> = ({ name, overview, title = 'Overview' }) => {
  if (!overview) {
    return null;
  }

  // Function to make the name bold if it exists in the overview
  const formatOverview = () => {
    if (!name) {
      return overview;
    }

    // Escape special regex characters in the name
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Create regex to find the name (case-insensitive, first occurrence)
    const regex = new RegExp(`(${escapedName})`, 'i');

    // Split the overview by the name
    const parts = overview.split(regex);

    return parts.map((part, index) => {
      // Check if this part matches the name (case-insensitive)
      if (part.toLowerCase() === name.toLowerCase()) {
        return <strong key={index}>{part}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <h2 className="text-2xl font-normal text-gray-600 mb-4">{title}</h2>
        <div className="border-t-2 border-gray-200 pt-4">
          <p className="text-gray-800 leading-relaxed text-justify">{formatOverview()}</p>
        </div>
      </div>
    </div>
  );
};

export default TourOverview;