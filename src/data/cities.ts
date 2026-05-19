export interface CityItem {
  id: string;
  zhName: string;
  enName: string;
}

export interface CountryGroup {
  id: string;
  flag: string;
  zhName: string;
  enName: string;
  gmtOffset: number; // e.g. 7 → GMT+7
  cities: CityItem[];
}

export const COUNTRY_GROUPS: CountryGroup[] = [
  {
    id: "thailand",
    flag: "🇹🇭",
    zhName: "泰国",
    enName: "Thailand",
    gmtOffset: 7,
    cities: [
      { id: "bangkok",   zhName: "曼谷",   enName: "Bangkok"   },
      { id: "chonburi",  zhName: "春武里", enName: "Chonburi"  },
      { id: "khon_kaen", zhName: "孔敬",   enName: "Khon Kaen" },
    ],
  },
  {
    id: "malaysia",
    flag: "🇲🇾",
    zhName: "马来西亚",
    enName: "Malaysia",
    gmtOffset: 8,
    cities: [
      { id: "johor_bahru",  zhName: "新山及周边地区",   enName: "Johor Bahru & Surroundings"   },
      { id: "kuala_lumpur", zhName: "吉隆坡",           enName: "Kuala Lumpur"                 },
      { id: "kuching",      zhName: "古晋",             enName: "Kuching"                      },
      { id: "malacca",      zhName: "马六甲",           enName: "Malacca"                      },
      { id: "penang",       zhName: "槟城及周边州属",   enName: "Penang & Surrounding States"  },
    ],
  },
  {
    id: "indonesia",
    flag: "🇮🇩",
    zhName: "印尼",
    enName: "Indonesia",
    gmtOffset: 7,
    cities: [
      { id: "bandung",    zhName: "万隆",   enName: "Bandung"    },
      { id: "cirebon",    zhName: "井里汶", enName: "Cirebon"    },
      { id: "jakarta",    zhName: "雅加达", enName: "Jakarta"    },
      { id: "malang",     zhName: "玛琅",   enName: "Malang"     },
      { id: "medan",      zhName: "棉兰",   enName: "Medan"      },
      { id: "semarang",   zhName: "三宝垄", enName: "Semarang"   },
      { id: "surabaya",   zhName: "泗水",   enName: "Surabaya"   },
      { id: "yogyakarta", zhName: "日惹",   enName: "Yogyakarta" },
    ],
  },
  {
    id: "vietnam",
    flag: "🇻🇳",
    zhName: "越南",
    enName: "Vietnam",
    gmtOffset: 7,
    cities: [
      { id: "can_tho",     zhName: "芹苴及湄公河三角洲",   enName: "Can Tho & Mekong Delta"          },
      { id: "da_nang",     zhName: "岘港及中部省份",       enName: "Da Nang & Central Provinces"     },
      { id: "hanoi",       zhName: "河内及周边地区",       enName: "Hanoi & Surroundings"            },
      { id: "ho_chi_minh", zhName: "胡志明市及周边地区",   enName: "Ho Chi Minh City & Surroundings" },
      { id: "thai_nguyen", zhName: "太原及北部地区",       enName: "Thai Nguyen & Northern Areas"    },
    ],
  },
];

export const DEFAULT_CITY_ID = "bangkok";

export function findCity(cityId: string): { city: CityItem; country: CountryGroup } | null {
  for (const country of COUNTRY_GROUPS) {
    const city = country.cities.find((c) => c.id === cityId);
    if (city) return { city, country };
  }
  return null;
}
