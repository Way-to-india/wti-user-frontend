interface Location {
  latitude?: number;
  longitude?: number;
  address?: {
    addressLine1?: string;
    cityId?: {
      _path?: {
        segments?: string[];
      };
    };
    pinCode?: string;
  };
}

export function calculateRating(rating?: number, type?: string, category?: string): number {
  if (rating) return rating;

  if (type === 'hotel' && category) {
    const categoryRatings: { [key: string]: number } = {
      Luxury: 5,
      Premium: 4,
      Budget: 3,
    };
    return categoryRatings[category] || 4;
  }

  return 5;
}

export function getLocationString(location: Location): string {
  if (!location?.address) return '';

  const addressLine = location.address.addressLine1 || '';
  const cityName = location.address.cityId?._path?.segments?.[1] || '';
  const pinCode = location.address.pinCode ? ` - ${location.address.pinCode}` : '';

  return `${addressLine}${cityName ? `, ${cityName}` : ''}${pinCode}`;
}
