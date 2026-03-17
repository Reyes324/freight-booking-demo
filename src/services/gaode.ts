// 高德地图 API 实现
import type { AddressSuggestion } from './addressService';

export async function searchAddressGaode(
  query: string
): Promise<AddressSuggestion[]> {
  if (!query || query.length < 1) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/search-gaode?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      console.error('Gaode API error:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Gaode search failed:', error);
    return [];
  }
}
