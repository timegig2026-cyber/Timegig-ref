// Calculate distance in kilometers using the Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(km: number): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Format coordinates to readable string
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

// Reverse geocode latitude and longitude to a human-readable location name (No API costs)
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      }
    );
    const data = await res.json();
    if (data && data.address) {
      const addr = data.address;
      const parts = [
        addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood,
        addr.city || addr.town || addr.village || addr.municipality,
        addr.state || addr.province || addr.country,
      ].filter(Boolean);

      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
    if (data && data.display_name) {
      return data.display_name.split(',').slice(0, 3).join(', ');
    }
    return 'Current Location';
  } catch {
    return 'Current Location';
  }
}
