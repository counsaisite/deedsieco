import { NextRequest } from 'next/server';

// Get client IP from request (works with Netlify, Vercel, etc.)
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp;
  return '127.0.0.1';
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  if (ip === '127.0.0.1' || ip === '::1') {
    return Response.json({
      countryCode: 'US',
      countryName: 'United States',
      region: 'CA',
      regionName: 'California',
      city: 'San Francisco',
      lat: 37.7749,
      lng: -122.4194,
      timezone: 'America/Los_Angeles',
      source: 'fallback',
    });
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    if (data.status !== 'success') {
      return Response.json({ error: 'Geo lookup failed' }, { status: 500 });
    }
    return Response.json({
      countryCode: data.countryCode,
      countryName: data.country,
      region: data.region,
      regionName: data.regionName,
      city: data.city,
      lat: data.lat,
      lng: data.lon,
      timezone: data.timezone,
      source: 'ip-api',
    });
  } catch {
    return Response.json({ error: 'Geo lookup failed' }, { status: 500 });
  }
}
