// Mock address data for testing
import type { AddressSuggestion } from './addressService';

const mockAddressDatabase: AddressSuggestion[] = [
  {
    id: '1',
    mainText: '中环国际金融中心',
    secondaryText: '中西区, 香港',
    latitude: 22.2850,
    longitude: 114.1580,
  },
  {
    id: '2',
    mainText: '中环站',
    secondaryText: '港铁中环站, 中西区, 香港',
    latitude: 22.2819,
    longitude: 114.1581,
  },
  {
    id: '3',
    mainText: '旺角东站',
    secondaryText: '油尖旺区, 九龙, 香港',
    latitude: 22.3220,
    longitude: 114.1730,
  },
  {
    id: '4',
    mainText: '旺角',
    secondaryText: '油尖旺区, 九龙, 香港',
    latitude: 22.3193,
    longitude: 114.1694,
  },
  {
    id: '5',
    mainText: '尖沙咀',
    secondaryText: '油尖旺区, 九龙, 香港',
    latitude: 22.2976,
    longitude: 114.1722,
  },
  {
    id: '6',
    mainText: '香港国际机场',
    secondaryText: '大屿山, 香港',
    latitude: 22.3080,
    longitude: 113.9185,
  },
  {
    id: '7',
    mainText: '铜锣湾时代广场',
    secondaryText: '湾仔区, 香港岛, 香港',
    latitude: 22.2783,
    longitude: 114.1826,
  },
  {
    id: '8',
    mainText: '油麻地',
    secondaryText: '油尖旺区, 九龙, 香港',
    latitude: 22.3130,
    longitude: 114.1707,
  },
  {
    id: '9',
    mainText: '佐敦',
    secondaryText: '油尖旺区, 九龙, 香港',
    latitude: 22.3045,
    longitude: 114.1720,
  },
  {
    id: '10',
    mainText: '红磡',
    secondaryText: '九龙城区, 九龙, 香港',
    latitude: 22.3050,
    longitude: 114.1882,
  },
];

export async function searchAddressMock(query: string): Promise<AddressSuggestion[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));

  if (!query || query.length < 1) {
    return [];
  }

  // Filter based on query
  const results = mockAddressDatabase.filter(addr =>
    addr.mainText.toLowerCase().includes(query.toLowerCase()) ||
    addr.secondaryText.toLowerCase().includes(query.toLowerCase())
  );

  return results.slice(0, 5);
}
