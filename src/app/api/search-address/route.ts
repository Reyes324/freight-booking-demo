import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Add "hong kong" to query for better results
    const searchQuery = `${query} hong kong`;

    const params = new URLSearchParams({
      q: searchQuery,
      format: 'json',
      addressdetails: '1',
      limit: '8',
      'accept-language': 'zh-CN,en',
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          'User-Agent': 'LalamoveEnterpriseDemo/1.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Nominatim error:', response.status);
      return NextResponse.json([]);
    }

    const results = await response.json();

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json([]);
    }

    const suggestions = results.map((result: any) => {
      const parts = result.display_name.split(',').map((p: string) => p.trim());

      // Try to extract meaningful main and secondary text
      let mainText = result.name || parts[0] || result.display_name;
      let secondaryText = parts.slice(1, 3).join(', ') || '香港';

      return {
        id: result.place_id.toString(),
        mainText,
        secondaryText,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        placeId: result.place_id.toString(),
      };
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }
}
