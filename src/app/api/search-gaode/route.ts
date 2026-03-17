import { NextRequest, NextResponse } from 'next/server';

const GAODE_KEY = 'a25941f912b53f8104494e9e8e315958';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.length < 1) {
    return NextResponse.json([]);
  }

  try {
    const params = new URLSearchParams({
      key: GAODE_KEY,
      keywords: query,
      city: '香港',
      citylimit: 'true',
      output: 'json',
    });

    const response = await fetch(
      `https://restapi.amap.com/v3/assistant/inputtips?${params}`
    );

    if (!response.ok) {
      console.error('Gaode API error:', response.status);
      return NextResponse.json([]);
    }

    const data = await response.json();

    if (data.status !== '1' || !data.tips) {
      console.error('Gaode API response error:', data);
      return NextResponse.json([]);
    }

    const suggestions = data.tips
      .filter((tip: any) => typeof tip.location === 'string' && tip.location.includes(','))
      .map((tip: any) => {
        const [lng, lat] = tip.location.split(',');
        return {
          id: tip.id,
          mainText: tip.name,
          secondaryText: tip.district || tip.address || '香港',
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          placeId: tip.id,
        };
      });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error('Gaode search error:', error);
    return NextResponse.json([]);
  }
}
