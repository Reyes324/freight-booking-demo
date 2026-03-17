// Address search service interface
// Easy to swap between Mock, Nominatim, Gaode, Google, etc.

export interface AddressSuggestion {
  id: string;
  mainText: string;
  secondaryText: string;
  latitude?: number;
  longitude?: number;
  placeId?: string;
}

export interface AddressSearchService {
  search(query: string): Promise<AddressSuggestion[]>;
}

// Current implementation - Gaode Maps API
import { searchAddressGaode } from './gaode';

export const searchAddress = searchAddressGaode;

// Alternatives:
// import { searchAddressMock } from './mockAddresses';
// import { searchAddressNominatim } from './nominatim';
