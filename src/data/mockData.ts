export interface Vehicle {
  id: string;
  name: string;
  image: string;
  dimensions?: string;
  weight?: string;
  description?: string;
  maxPassengers?: number;
}

export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  recommended?: boolean;
  icon?: string;
}

export interface AddressDetail {
  address: string;
  contactName: string;
  phone: string;
  unit?: string;
  lat?: number;
  lng?: number;
}

export const vehicles: Vehicle[] = [
  {
    id: "van",
    name: "Van仔",
    image: "/vehicles/van.png",
    dimensions: "1.8 x 1.2 x 1.2 米",
    weight: "800 kg",
    description: "适合多件运送，包括建材、小型家电等等。最多可载人数：5（不包括司机）",
    maxPassengers: 5,
  },
  {
    id: "courier",
    name: "速递专员",
    image: "/vehicles/courier.png",
    dimensions: "0.4 x 0.4 x 0.4 米",
    weight: "10 kg",
    description: "适合小型货物，由电单车或特选步兵运送，更快速为您配对订单",
  },
  {
    id: "motorcycle",
    name: "电单车",
    image: "/vehicles/motorcycle.png",
    dimensions: "0.4 x 0.4 x 0.4 米",
    weight: "10 kg",
    description: "适合上门取件送货及小件快速运送（易碎物品如蛋糕较适合由步兵运送）",
  },
  {
    id: "walker",
    name: "步兵",
    image: "/vehicles/walker.png",
    dimensions: "0.4 x 0.4 x 0.4 米",
    weight: "10 kg",
    description: "适合上门取件送货及同区小件运送（适合运送易碎物件，如蛋糕）",
  },
  {
    id: "truck-5.5t",
    name: "5.5吨货车",
    image: "/vehicles/truck.png",
    dimensions: "4.5 x 1.8 x 1.8 米",
    weight: "1200 kg",
    description: "适合家具、家电、企业物流等等",
  },
  {
    id: "truck-9t",
    name: "9吨货车",
    image: "/vehicles/truck.png",
    dimensions: "6 x 1.8 x 1.8 米",
    weight: "3500 kg",
    description: "适合搬屋、搬写字楼、企业物流等等",
  },
  {
    id: "van-hourly",
    name: "Van仔包钟（3小时）",
    image: "/vehicles/van.png",
    dimensions: "1.8 x 1.2 x 1.2 米",
    weight: "800 kg",
    description: "适合多件运送，包括建材、小型家电等等",
  },
  {
    id: "truck-5.5t-hourly",
    name: "5.5吨货车包钟（3小时）",
    image: "/vehicles/truck.png",
    dimensions: "4.5 x 1.8 x 1.8 米",
    weight: "1200 kg",
    description: "适合家具、家电、企业物流等等",
  },
  {
    id: "truck-9t-hourly",
    name: "9吨货车包钟（3小时）",
    image: "/vehicles/truck.png",
    dimensions: "6 x 1.8 x 1.8 米",
    weight: "3500 kg",
    description: "适合家具、家电、企业物流等等",
  },
];

// ── Currency config (for future region switching) ──
export const currencyConfig = {
  code: "HKD",
  symbol: "HK$",
  locale: "zh-HK",
};

// ── Additional Services: per-vehicle type system ──
export interface VehicleServiceItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface VehicleServiceGroup {
  id: string;
  name: string;
  type: "group";
  maxSelect?: number; // 1 = radio-like, undefined = unlimited
  items: VehicleServiceItem[];
}

export type VehicleService = VehicleServiceItem | VehicleServiceGroup;

export function isServiceGroup(s: VehicleService): s is VehicleServiceGroup {
  return "type" in s && s.type === "group";
}

// ── Reusable tunnel toll builders (prices differ by vehicle size) ──
const tunnelsSmall = (): VehicleServiceGroup => ({
  id: "tunnels",
  name: "隧道费",
  type: "group",
  items: [
    { id: "t-cross", name: "红磡海底隧道", price: 8, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-eastern", name: "东区海底隧道", price: 8, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-lion", name: "狮子山隧道", price: 8 },
    { id: "t-tate", name: "大老山隧道", price: 15 },
    { id: "t-tailam", name: "大榄隧道", price: 7, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-tsim", name: "尖山隧道", price: 8 },
    { id: "t-aberdeen", name: "香港仔隧道", price: 8 },
    { id: "t-western", name: "西区海底隧道", price: 8, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-shingmun", name: "城门隧道", price: 8 },
  ],
});

const tunnelsVan = (): VehicleServiceGroup => ({
  id: "tunnels",
  name: "隧道费",
  type: "group",
  items: [
    { id: "t-cross", name: "红磡海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-eastern", name: "东区海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-lion", name: "狮子山隧道", price: 8 },
    { id: "t-tate", name: "大老山隧道", price: 24 },
    { id: "t-tailam", name: "大榄隧道", price: 43, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-tsim", name: "尖山隧道", price: 8 },
    { id: "t-aberdeen", name: "香港仔隧道", price: 8 },
    { id: "t-western", name: "西区海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-shingmun", name: "城门隧道", price: 8 },
  ],
});

const tunnelsTruck55 = (): VehicleServiceGroup => ({
  id: "tunnels",
  name: "隧道费",
  type: "group",
  items: [
    { id: "t-cross", name: "红磡海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-eastern", name: "东区海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-lion", name: "狮子山隧道", price: 8 },
    { id: "t-tate", name: "大老山隧道", price: 24 },
    { id: "t-tailam", name: "大榄隧道", price: 43, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-tsim", name: "尖山隧道", price: 8 },
    { id: "t-aberdeen", name: "香港仔隧道", price: 8 },
    { id: "t-western", name: "西区海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-shingmun", name: "城门隧道", price: 8 },
  ],
});

const tunnelsTruck9 = (): VehicleServiceGroup => ({
  id: "tunnels",
  name: "隧道费",
  type: "group",
  items: [
    { id: "t-cross", name: "红磡海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-eastern", name: "东区海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-lion", name: "狮子山隧道", price: 8 },
    { id: "t-tate", name: "大老山隧道", price: 28 },
    { id: "t-tailam", name: "大榄隧道", price: 43, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-tsim", name: "尖山隧道", price: 8 },
    { id: "t-aberdeen", name: "香港仔隧道", price: 8 },
    { id: "t-western", name: "西区海底隧道", price: 50, description: "根据进入隧道的时间，可能会另外衍生额外费用" },
    { id: "t-shingmun", name: "城门隧道", price: 8 },
  ],
});

// ── Per-vehicle additional services ──
export const vehicleServicesMap: Record<string, VehicleService[]> = {
  // ── 电单车：最少服务 ──
  motorcycle: [
    { id: "thermal-bag", name: "保温袋", price: 0 },
    { id: "english-driver", name: "英文司机", price: 0 },
  ],

  // ── 速递专员 ──
  courier: [
    { id: "thermal-bag", name: "保温袋", price: 0 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsSmall(),
  ],

  // ── 步兵 ──
  walker: [
    { id: "thermal-bag", name: "保温袋", price: 0 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsSmall(),
  ],

  // ── Van仔 ──
  van: [
    { id: "premium-car", name: "星级尊车", price: 30 },
    {
      id: "passenger",
      name: "有人跟车",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "p-1", name: "1 人跟车", price: 0 },
        { id: "p-2", name: "2 人跟车", price: 0 },
        { id: "p-3", name: "3 人跟车", price: 0 },
        { id: "p-4", name: "4 人跟车", price: 0 },
        { id: "p-5", name: "5 人跟车", price: 0 },
      ],
    },
    { id: "pet", name: "接送宠物", price: 10 },
    {
      id: "moving",
      name: "帮搬服务",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "m-1s", name: "单边上门，最多2件，总重20kg内", price: 78 },
        { id: "m-1d", name: "两边上门，最多2件，总重20kg内", price: 156 },
        { id: "m-2s", name: "单边上门（总重70kg内，最多10箱）", price: 100 },
        { id: "m-2d", name: "两边上门（总重70kg内，最多10箱）", price: 200 },
        { id: "m-other", name: "其他尺寸或重量（由司机报价）", price: 0 },
      ],
    },
    { id: "over6ft", name: "货物长度超过6呎", price: 20 },
    { id: "over6ft-tall", name: "货物长度超过6呎 高度超过2呎", price: 40 },
    { id: "trolley", name: "租用车仔", price: 10 },
    { id: "flatbed", name: "租用板车", price: 10 },
    { id: "fold-seat", name: "收起后座", price: 15 },
    { id: "jumpstart", name: "搭电服务[过江龙]", price: 200 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsVan(),
    { id: "landfill", name: "进入堆填区", price: 50 },
    { id: "construction", name: "进入地盘", price: 20 },
    { id: "safety-card", name: "平安卡", price: 50 },
    { id: "construction-waste", name: "运送或弃置建筑废料（由司机报价）", price: 0 },
  ],

  // ── 5.5吨货车 ──
  "truck-5.5t": [
    {
      id: "pallet",
      name: "板货唧车运送",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "pl-1", name: "1板（每板连卡板≤500kg）", price: 200 },
        { id: "pl-2", name: "2板", price: 400 },
        { id: "pl-3", name: "3板", price: 600 },
        { id: "pl-4", name: "4板", price: 800 },
        { id: "pl-5", name: "5板", price: 1000 },
        { id: "pl-other", name: "其他数量或重量（由司机报价）", price: 0 },
      ],
    },
    {
      id: "heavy-item",
      name: "大型物件搬运",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "hi-1", name: "1件（<50kg，三边总和<400cm）", price: 350 },
        { id: "hi-2", name: "2件（每件<50kg）", price: 500 },
        { id: "hi-3", name: "3件（每件<50kg）", price: 650 },
        { id: "hi-other", name: "其他数量或体积（由司机报价）", price: 0 },
      ],
    },
    {
      id: "passenger",
      name: "有人跟车",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "p-2", name: "最多 2 人跟车", price: 0 },
        { id: "p-5", name: "最多 5 人跟车", price: 20 },
      ],
    },
    { id: "trolley", name: "租用车仔", price: 10 },
    { id: "jack", name: "租用唧车", price: 20 },
    { id: "tailgate", name: "尾板", price: 0 },
    { id: "flatbed", name: "租用板车", price: 10 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsTruck55(),
    { id: "landfill", name: "进入堆填区", price: 100 },
    { id: "construction", name: "进入地盘", price: 40 },
    { id: "safety-card", name: "平安卡", price: 70 },
    { id: "construction-waste", name: "运送或弃置建筑废料（由司机报价）", price: 0 },
  ],

  // ── 9吨货车 ──
  "truck-9t": [
    {
      id: "pallet",
      name: "板货唧车运送",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "pl-1", name: "1板（每板连卡板≤500kg）", price: 200 },
        { id: "pl-2", name: "2板", price: 400 },
        { id: "pl-3", name: "3板", price: 600 },
        { id: "pl-4", name: "4板", price: 800 },
        { id: "pl-5", name: "5板", price: 1000 },
        { id: "pl-other", name: "其他数量或重量（由司机报价）", price: 0 },
      ],
    },
    {
      id: "heavy-item",
      name: "大型物件搬运",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "hi-1", name: "1件（<50kg，三边总和<400cm）", price: 350 },
        { id: "hi-2", name: "2件（每件<50kg）", price: 500 },
        { id: "hi-3", name: "3件（每件<50kg）", price: 650 },
        { id: "hi-other", name: "其他数量或体积（由司机报价）", price: 0 },
      ],
    },
    {
      id: "passenger",
      name: "有人跟车",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "p-2", name: "最多 2 人跟车", price: 0 },
        { id: "p-5", name: "最多 5 人跟车", price: 20 },
      ],
    },
    { id: "trolley", name: "租用车仔", price: 10 },
    { id: "jack", name: "租用唧车", price: 20 },
    { id: "tailgate", name: "尾板", price: 0 },
    { id: "flatbed", name: "租用板车", price: 10 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsTruck9(),
    { id: "landfill", name: "进入堆填区", price: 150 },
    { id: "construction", name: "进入地盘", price: 60 },
    { id: "safety-card", name: "平安卡", price: 100 },
    { id: "construction-waste", name: "运送或弃置建筑废料（由司机报价）", price: 0 },
  ],

  // ── Van仔包钟（3小时） ──
  "van-hourly": [
    {
      id: "extra-hours",
      name: "额外包钟",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "eh-1", name: "额外包钟1小时（总共4小时）", price: 110 },
        { id: "eh-2", name: "额外包钟2小时（总共5小时）", price: 220 },
        { id: "eh-3", name: "额外包钟3小时（总共6小时）", price: 330 },
        { id: "eh-4", name: "额外包钟4小时（总共7小时）", price: 440 },
        { id: "eh-5", name: "额外包钟5小时（总共8小时）", price: 550 },
      ],
    },
    { id: "premium-car", name: "星级尊车", price: 30 },
    {
      id: "passenger",
      name: "有人跟车",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "p-2", name: "最多 2 人跟车", price: 0 },
        { id: "p-5", name: "最多 5 人跟车", price: 0 },
      ],
    },
    { id: "pet", name: "接送宠物", price: 10 },
    {
      id: "moving",
      name: "帮搬服务",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "m-1s", name: "单边上门，最多2件，总重20kg内", price: 78 },
        { id: "m-1d", name: "两边上门，最多2件，总重20kg内", price: 156 },
        { id: "m-2s", name: "单边上门（总重70kg内，最多10箱）", price: 100 },
        { id: "m-2d", name: "两边上门（总重70kg内，最多10箱）", price: 200 },
        { id: "m-other", name: "其他尺寸或重量（由司机报价）", price: 0 },
      ],
    },
    { id: "over6ft", name: "货物长度超过6呎", price: 20 },
    { id: "over6ft-tall", name: "货物长度超过6呎 高度超过2呎", price: 40 },
    { id: "trolley", name: "租用车仔", price: 10 },
    { id: "flatbed", name: "租用板车", price: 10 },
    { id: "fold-seat", name: "收起后座", price: 15 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsVan(),
    { id: "landfill", name: "进入堆填区", price: 50 },
    { id: "construction", name: "进入地盘", price: 20 },
    { id: "safety-card", name: "平安卡", price: 50 },
    { id: "construction-waste", name: "运送或弃置建筑废料（由司机报价）", price: 0 },
  ],

  // ── 5.5吨货车包钟（3小时） ──
  "truck-5.5t-hourly": [
    {
      id: "extra-hours",
      name: "额外包钟",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "eh-1", name: "额外包钟1小时（总共4小时）", price: 160 },
        { id: "eh-2", name: "额外包钟2小时（总共5小时）", price: 320 },
        { id: "eh-3", name: "额外包钟3小时（总共6小时）", price: 480 },
      ],
    },
    {
      id: "pallet",
      name: "板货唧车运送",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "pl-1", name: "1板（每板连卡板≤500kg）", price: 200 },
        { id: "pl-2", name: "2板", price: 400 },
        { id: "pl-3", name: "3板", price: 600 },
        { id: "pl-other", name: "其他数量或重量（由司机报价）", price: 0 },
      ],
    },
    {
      id: "heavy-item",
      name: "大型物件搬运",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "hi-1", name: "1件（<50kg，三边总和<400cm）", price: 350 },
        { id: "hi-2", name: "2件（每件<50kg）", price: 500 },
        { id: "hi-3", name: "3件（每件<50kg）", price: 650 },
        { id: "hi-other", name: "其他数量或体积（由司机报价）", price: 0 },
      ],
    },
    {
      id: "passenger",
      name: "有人跟车",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "p-2", name: "最多 2 人跟车", price: 0 },
        { id: "p-5", name: "最多 5 人跟车", price: 20 },
      ],
    },
    { id: "trolley", name: "租用车仔", price: 10 },
    { id: "jack", name: "租用唧车", price: 20 },
    { id: "tailgate", name: "尾板", price: 0 },
    { id: "flatbed", name: "租用板车", price: 10 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsTruck55(),
    { id: "landfill", name: "进入堆填区", price: 100 },
    { id: "construction", name: "进入地盘", price: 40 },
    { id: "safety-card", name: "平安卡", price: 70 },
    { id: "construction-waste", name: "运送或弃置建筑废料（由司机报价）", price: 0 },
  ],

  // ── 9吨货车包钟（3小时） ──
  "truck-9t-hourly": [
    {
      id: "extra-hours",
      name: "额外包钟",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "eh-1", name: "额外包钟1小时（总共4小时）", price: 200 },
        { id: "eh-2", name: "额外包钟2小时（总共5小时）", price: 400 },
        { id: "eh-3", name: "额外包钟3小时（总共6小时）", price: 600 },
      ],
    },
    {
      id: "pallet",
      name: "板货唧车运送",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "pl-1", name: "1板（每板连卡板≤500kg）", price: 200 },
        { id: "pl-2", name: "2板", price: 400 },
        { id: "pl-3", name: "3板", price: 600 },
        { id: "pl-other", name: "其他数量或重量（由司机报价）", price: 0 },
      ],
    },
    {
      id: "heavy-item",
      name: "大型物件搬运",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "hi-1", name: "1件（<50kg，三边总和<400cm）", price: 350 },
        { id: "hi-2", name: "2件（每件<50kg）", price: 500 },
        { id: "hi-3", name: "3件（每件<50kg）", price: 650 },
        { id: "hi-other", name: "其他数量或体积（由司机报价）", price: 0 },
      ],
    },
    {
      id: "passenger",
      name: "有人跟车",
      type: "group",
      maxSelect: 1,
      items: [
        { id: "p-2", name: "最多 2 人跟车", price: 0 },
        { id: "p-5", name: "最多 5 人跟车", price: 20 },
      ],
    },
    { id: "trolley", name: "租用车仔", price: 10 },
    { id: "jack", name: "租用唧车", price: 20 },
    { id: "tailgate", name: "尾板", price: 0 },
    { id: "flatbed", name: "租用板车", price: 10 },
    { id: "english-driver", name: "英文司机", price: 0 },
    tunnelsTruck9(),
    { id: "landfill", name: "进入堆填区", price: 150 },
    { id: "construction", name: "进入地盘", price: 60 },
    { id: "safety-card", name: "平安卡", price: 100 },
    { id: "construction-waste", name: "运送或弃置建筑废料（由司机报价）", price: 0 },
  ],
};

export const serviceOptions: ServiceOption[] = [
  {
    id: "priority",
    name: "优先订单",
    description: "加快配对司机送货",
    price: 117.0,
    currency: "HK$",
    icon: "⚡",
  },
  {
    id: "standard",
    name: "标准订单",
    description: "加快配对司机送货",
    price: 74.0,
    currency: "HK$",
    recommended: true,
  },
  {
    id: "discount",
    name: "优先订单",
    description: "加快配对司机送货",
    price: 117.0,
    currency: "HK$",
    icon: "🏷️",
  },
];

// ── Order-related types ──

// 订单草稿（主页 → 确认页传递）
export interface OrderDraft {
  pickup: AddressDetail;
  dropoff: AddressDetail;
  vehicle: Vehicle;
  pricingOption: 'priority' | 'standard';
  selectedServices: {
    itemIds: string[];
    groupSelections: Record<string, string[]>;
  };
  basePrice: number;
  totalPrice: number;
}

// 订单确认信息（确认页用户填写）
export interface OrderConfirmation {
  scheduledTime?: Date; // undefined = 现在用车
  driverNote: string;   // 最多 500 字
  paymentMethod: 'credit'; // 当前只支持账期支付
}

// 完整订单（最终提交）
export interface CompleteOrder extends OrderDraft, OrderConfirmation {
  orderId?: string;
  createdAt: Date;
}
