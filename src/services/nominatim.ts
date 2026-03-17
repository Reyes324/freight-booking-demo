import type { AddressSuggestion } from './addressService';

export async function searchAddressNominatim(
  query: string
): Promise<AddressSuggestion[]> {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `/api/search-address?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Address search error:', error);
    return [];
  }
}
