'use client';

import { useState, useEffect } from 'react';

export type GeoLocation = {
  countryCode: string;
  countryName: string;
  region: string;
  regionName: string;
  city: string;
  lat: number;
  lng: number;
  timezone: string;
  source: string;
};

export function useLocation() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/geo')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setLocation(data);
      })
      .catch(() => setError('Failed to get location'))
      .finally(() => setLoading(false));
  }, []);

  return { location, loading, error };
}
