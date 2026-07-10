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
      { id: "bangkok",   zhName: "曼谷及中部地区（大城、暖武里、北榄、巴吞他尼）",   enName: "Bangkok & Central Region (Ayutthaya, Nonthaburi, Samut Prakan, Pathum Thani)"   },
      { id: "chonburi",  zhName: "春武里及东部地区（芭提雅、罗勇、北柳、达叻）", enName: "Chonburi & Eastern Region (Pattaya, Rayong, Chachoengsao, Trat)"  },
      { id: "khon_kaen", zhName: "孔敬及东北部地区（乌隆他尼、玛哈沙拉堪）",   enName: "Khon Kaen & Northeastern Region (Udon Thani, Mahasarakham)" },
    ],
  },
  {
    id: "malaysia",
    flag: "🇲🇾",
    zhName: "马来西亚",
    enName: "Malaysia",
    gmtOffset: 8,
    cities: [
      { id: "east_coast_malaysia", zhName: "马来西亚东海岸（彭亨、登嘉楼、吉兰丹）", enName: "East Coast Malaysia (Pahang, Terengganu & Kelantan)" },
      { id: "johor_bahru",  zhName: "柔佛及周边地区",   enName: "Johor & Nearby Districts"   },
      { id: "kuala_lumpur", zhName: "吉隆坡",           enName: "Kuala Lumpur"                 },
      { id: "kuching",      zhName: "古晋",             enName: "Kuching"                      },
      { id: "malacca",      zhName: "马六甲",           enName: "Malacca"                      },
      { id: "penang",       zhName: "槟城及北部州属（霹雳、吉打、玻璃市）",   enName: "Penang & Northern States (Perak, Kedah, Perlis)"  },
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
      { id: "can_tho",     zhName: "芹苴及湄公河三角洲（西宁、金瓯）",   enName: "Can Tho & Mekong Delta Region (Tay Ninh, CaMau)"          },
      { id: "da_nang",     zhName: "岘港及中部省份（清化、顺化、林同、庆和）",       enName: "Da Nang & Central Provinces (Thanh Hoa, Hue, Lam Dong, Khanh Hoa)"     },
      { id: "hanoi",       zhName: "河内及周边地区（北宁、海防、兴安、宁平）",       enName: "Hanoi & Nearby Regions (Bac Ninh, Hai Phong, Hung Yen, Ninh Binh)"            },
      { id: "ho_chi_minh", zhName: "胡志明市及周边地区（同奈、原头顿及平阳）",   enName: "Ho Chi Minh City & Nearby Regions (Dong Nai, former Vung Tau & Binh Duong)" },
      { id: "thai_nguyen", zhName: "太原及北部地区（宣光、老街）",       enName: "Thai Nguyen & Northern Region (Tuyen Quang, Lao Cai)"    },
    ],
  },
  {
    id: "singapore",
    flag: "🇸🇬",
    zhName: "新加坡",
    enName: "Singapore",
    gmtOffset: 8,
    cities: [
      { id: "singapore", zhName: "新加坡", enName: "Singapore" },
    ],
  },
  {
    id: "philippines",
    flag: "🇵🇭",
    zhName: "菲律宾",
    enName: "Philippines",
    gmtOffset: 8,
    cities: [
      { id: "manila_ncr",    zhName: "马尼拉国家首都大区及南吕宋", enName: "Manila NCR & South Luzon (Rizal, Bulacan, Cavite, Laguna, Quezon, Batangas, Bicol)" },
      { id: "cebu",          zhName: "宿务全岛、曼达韦、拉普拉普", enName: "Cebu Islandwide, Mandaue, Lapu-Lapu" },
      { id: "central_north_luzon", zhName: "中北吕宋（邦板牙、打拉、新怡诗夏、三描礼士、碧瑶、伊罗戈、邦阿西楠）", enName: "Central & North Luzon (Pampanga, Tarlac, Nueva Ecija, Zambales, Baguio, Ilocos, Pangasinan)" },
    ],
  },
  {
    id: "hong_kong",
    flag: "🇭🇰",
    zhName: "香港",
    enName: "Hong Kong",
    gmtOffset: 8,
    cities: [
      { id: "hong_kong", zhName: "香港", enName: "Hong Kong" },
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
