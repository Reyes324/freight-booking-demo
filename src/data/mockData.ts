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
  code: "THB",
  symbol: "฿",
  locale: "th-TH",
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
    id: "economy",
    name: "经济订单",
    description: "正常配对司机送货",
    price: 150.0,
    currency: "฿",
  },
  {
    id: "standard",
    name: "标准订单",
    description: "加快配对司机送货",
    price: 220.0,
    currency: "฿",
    recommended: true,
  },
  {
    id: "priority",
    name: "优先订单",
    description: "最快配对司机送货",
    price: 350.0,
    currency: "฿",
  },
];

// ── Order-related types ──

// 订单草稿（主页 → 确认页传递）
export interface OrderDraft {
  pickup: AddressDetail;
  dropoff: AddressDetail;
  waypoints?: AddressDetail[]; // 途经点（可选）
  vehicle: Vehicle;
  pricingOption: 'economy' | 'standard' | 'priority';
  selectedServices: {
    itemIds: string[];
    groupSelections: Record<string, string[]>;
  };
  basePrice: number;
  totalPrice: number;
}

// 订单确认信息（确认页用户填写）
export interface OrderConfirmation {
  contactPhone: string;    // 订单联系电话，默认 +66
  scheduledTime?: Date; // undefined = 现在用车
  driverNote: string;   // 最多 500 字
  paymentMethod: 'credit'; // 当前只支持账期支付
}

// 完整订单（最终提交）
export interface CompleteOrder extends OrderDraft, OrderConfirmation {
  orderId?: string;
  createdAt: Date;
}

// ── Order Status Types ──
export type OrderStatus =
  | 'calling_driver'    // 呼叫司机中
  | 'in_transit'        // 前往装货地
  | 'delivering'        // 配送中
  | 'cancelled'         // 订单已取消
  | 'completed'         // 订单已完成

// ── Price Adjustment ──
export interface PriceAdjustment {
  adjustedPrice: number;       // 调整后的总价
  status: 'pending';           // 审核状态（当前只有 pending）
  submittedAt: Date;
}

// ── Order Interface ──
export interface Order extends CompleteOrder {
  orderId: string;
  createdAt: Date; // 下单时间
  status: OrderStatus;
  subAccountId?: string; // 所属子账号 id（母子账号 Demo）；undefined = 母账号本部下单
  actualPickupTime?: Date;
  actualDropoffTime?: Date;
  completedTime?: Date;
  cancelledTime?: Date;
  driver?: {
    name: string;
    phone: string;
    vehiclePlate: string;
    avatar?: string;
    rating?: number;
  };
  pickupProofPhoto?: string;
  dropoffProofPhoto?: string;
  priceAdjustment?: PriceAdjustment;
}

// ── Mock Orders Data ──
export const mockOrders: Order[] = [
  {
    orderId: 'LLI-20260415-001',
    subAccountId: 'E001-VN',
    createdAt: new Date(),
    status: 'calling_driver',
    pickup: {
      address: '曼谷素坤逸路55号(通罗)',
      contactName: '张先生',
      phone: '+66 812 345 678',
      unit: '25楼A室',
      lat: 13.7367,
      lng: 100.5704,
    },
    dropoff: {
      address: '曼谷暹罗广场',
      contactName: '李小姐',
      phone: '+66 823 456 789',
      unit: '10楼',
      lat: 13.7453,
      lng: 100.5344,
    },
    vehicle: vehicles[4], // 5.5吨货车
    pricingOption: 'standard',
    selectedServices: {
      itemIds: [],
      groupSelections: {},
    },
    basePrice: 220.0,
    totalPrice: 220.0,
    contactPhone: '+66 812345678',
    scheduledTime: new Date(),
    driverNote: '',
    paymentMethod: 'credit',
  },
  {
    orderId: 'LLI-20260415-002',
    subAccountId: 'E001-TH',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'in_transit',
    pickup: {
      address: '曼谷是隆路中央世界商业中心',
      contactName: '王先生',
      phone: '+66 834 567 890',
      lat: 13.7472,
      lng: 100.5399,
    },
    waypoints: [
      {
        address: '曼谷素坤逸路Emporium百货',
        contactName: '林小姐',
        phone: '+66 845 111 222',
        lat: 13.7307,
        lng: 100.5698,
      },
    ],
    dropoff: {
      address: '曼谷阿索克路Terminal 21购物中心',
      contactName: '陈小姐',
      phone: '+66 845 678 901',
      lat: 13.7384,
      lng: 100.5609,
    },
    vehicle: vehicles[0], // Van仔
    pricingOption: 'priority',
    selectedServices: {
      itemIds: ['premium-car'],
      groupSelections: {},
    },
    basePrice: 350.0,
    totalPrice: 440.0,
    scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
    actualPickupTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    contactPhone: '+66 812345678',
    driverNote: '请小心搬运',
    paymentMethod: 'credit',
    driver: {
      name: '张师傅',
      phone: '+852 6789 0123',
      vehiclePlate: 'AB 1234',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.85,
    },
  },
  {
    orderId: 'LLI-20260415-003',
    subAccountId: 'E001-VN',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'delivering',
    pickup: {
      address: '曼谷拉差达披色路The Street商场',
      contactName: '周先生',
      phone: '+66 856 789 012',
      unit: '地下B铺',
      lat: 13.7650,
      lng: 100.5746,
    },
    waypoints: [
      {
        address: '曼谷席隆路BTS站',
        contactName: '赵先生',
        phone: '+66 845 333 444',
        lat: 13.7292,
        lng: 100.5266,
      },
      {
        address: '曼谷拉玛四世路隆比尼公园',
        contactName: '钱小姐',
        phone: '+66 845 555 666',
        lat: 13.7308,
        lng: 100.5419,
      },
    ],
    dropoff: {
      address: '曼谷惠恭王路尚泰世界购物中心',
      contactName: '何小姐',
      phone: '+66 867 890 123',
      lat: 13.7275,
      lng: 100.5441,
    },
    vehicle: vehicles[0], // Van仔
    pricingOption: 'standard',
    selectedServices: {
      itemIds: ['fold-seat'],
      groupSelections: { passenger: ['p-2'] },
    },
    basePrice: 220.0,
    totalPrice: 265.0,
    scheduledTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    actualPickupTime: new Date(Date.now() - 30 * 60 * 1000),
    contactPhone: '+66 812345678',
    driverNote: '有两箱易碎品，请轻拿轻放',
    paymentMethod: 'credit',
    driver: {
      name: '陈师傅',
      phone: '+852 6111 2233',
      vehiclePlate: 'EF 9012',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 4.78,
    },
    pickupProofPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
  },
  {
    orderId: 'LLI-20260414-004',
    subAccountId: 'E001-TH',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'completed',
    pickup: {
      address: '曼谷Emporium购物中心',
      contactName: '刘先生',
      phone: '+66 878 901 234',
      lat: 13.7308,
      lng: 100.5698,
    },
    dropoff: {
      address: '曼谷Silom Complex办公大楼',
      contactName: '黄小姐',
      phone: '+66 889 012 345',
      lat: 13.7289,
      lng: 100.5280,
    },
    vehicle: vehicles[2], // 电单车
    pricingOption: 'standard',
    selectedServices: {
      itemIds: [],
      groupSelections: {},
    },
    basePrice: 220.0,
    totalPrice: 220.0,
    scheduledTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 昨天
    actualPickupTime: new Date(Date.now() - 23.5 * 60 * 60 * 1000),
    completedTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
    contactPhone: '+66 812345678',
    driverNote: '',
    paymentMethod: 'credit',
    driver: {
      name: '李师傅',
      phone: '+852 6890 1234',
      vehiclePlate: 'CD 5678',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      rating: 4.92,
    },
    pickupProofPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
  },
  {
    orderId: 'LLI-20260413-005',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    status: 'cancelled',
    pickup: {
      address: '曼谷Mega Bangna购物中心',
      contactName: '吴先生',
      phone: '+66 890 123 456',
      lat: 13.6676,
      lng: 100.6392,
    },
    dropoff: {
      address: '曼谷拉玛九路中央广场大京都大厦',
      contactName: '赵小姐',
      phone: '+66 801 234 567',
      lat: 13.7489,
      lng: 100.5664,
    },
    vehicle: vehicles[5], // 9吨货车
    pricingOption: 'standard',
    selectedServices: {
      itemIds: [],
      groupSelections: {},
    },
    basePrice: 220.0,
    totalPrice: 220.0,
    contactPhone: '+66 812345678',
    scheduledTime: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2天前
    cancelledTime: new Date(Date.now() - 47.5 * 60 * 60 * 1000),
    driverNote: '',
    paymentMethod: 'credit',
  },
];

// ============================================
// 钱包相关类型和数据
// ============================================

export type TransactionType = 'topup' | 'payment' | 'refund';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: Date;
  orderId?: string;
  amount: number; // 正数=入账，负数=支出
  status: TransactionStatus;
  description: string;
  subAccountId?: string; // 所属子账号；undefined = 母账号本部
}

export interface WalletBalance {
  balance: number;
  creditLimit: number;
  currency: 'THB';
}

// Mock 钱包余额
export const mockWalletBalance: WalletBalance = {
  balance: 3750.00,
  creditLimit: 15000.00,
  currency: 'THB',
};

// Mock 交易记录（金额为泰铢，日期集中在近 30 天内，默认视图即可看到全部数据）
export const mockTransactions: Transaction[] = [
  // ── 2026-06-12（今天）──
  { id: 'TXN-20260612-001', type: 'payment', date: new Date('2026-06-12T09:15:00'), orderId: 'LLI-20260612-001', amount: -340.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260612-002', type: 'payment', date: new Date('2026-06-12T08:40:00'), orderId: 'LLI-20260612-002', amount: -280.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },

  // ── 2026-06-11 ──
  { id: 'TXN-20260611-003', type: 'payment', date: new Date('2026-06-11T16:30:00'), orderId: 'LLI-20260611-003', amount: -420.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260611-004', type: 'payment', date: new Date('2026-06-11T14:10:00'), orderId: 'LLI-20260611-004', amount: -255.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260611-005', type: 'payment', date: new Date('2026-06-11T10:50:00'), orderId: 'LLI-20260611-005', amount: -375.00, status: 'success', description: '订单支付' },

  // ── 2026-06-10 ──
  { id: 'TXN-20260610-006', type: 'topup',   date: new Date('2026-06-10T10:00:00'), orderId: undefined,           amount: 5000.00, status: 'success', description: '钱包充值' },
  { id: 'TXN-20260610-007', type: 'payment', date: new Date('2026-06-10T15:20:00'), orderId: 'LLI-20260610-007', amount: -310.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260610-008', type: 'payment', date: new Date('2026-06-10T11:35:00'), orderId: 'LLI-20260610-008', amount: -390.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },

  // ── 2026-06-09 ──
  { id: 'TXN-20260609-009', type: 'payment', date: new Date('2026-06-09T17:05:00'), orderId: 'LLI-20260609-009', amount: -265.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260609-010', type: 'payment', date: new Date('2026-06-09T13:25:00'), orderId: 'LLI-20260609-010', amount: -445.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260609-011', type: 'refund',  date: new Date('2026-06-09T11:00:00'), orderId: 'LLI-20260608-012', amount: 280.00,  status: 'success', description: '订单退款' },
  { id: 'TXN-20260609-012', type: 'payment', date: new Date('2026-06-09T09:40:00'), orderId: 'LLI-20260609-012', amount: -320.00, status: 'success', description: '订单支付' },

  // ── 2026-06-08 ──
  { id: 'TXN-20260608-013', type: 'payment', date: new Date('2026-06-08T16:45:00'), orderId: 'LLI-20260608-013', amount: -480.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260608-014', type: 'payment', date: new Date('2026-06-08T14:20:00'), orderId: 'LLI-20260608-014', amount: -230.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260608-015', type: 'payment', date: new Date('2026-06-08T10:15:00'), orderId: 'LLI-20260608-015', amount: -355.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },

  // ── 2026-06-07 ──
  { id: 'TXN-20260607-016', type: 'payment', date: new Date('2026-06-07T15:55:00'), orderId: 'LLI-20260607-016', amount: -295.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260607-017', type: 'payment', date: new Date('2026-06-07T11:30:00'), orderId: 'LLI-20260607-017', amount: -410.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260607-018', type: 'payment', date: new Date('2026-06-07T09:20:00'), orderId: 'LLI-20260607-018', amount: -275.00, status: 'success', description: '订单支付' },

  // ── 2026-06-06 ──
  { id: 'TXN-20260606-019', type: 'topup',   date: new Date('2026-06-06T10:00:00'), orderId: undefined,           amount: 3000.00, status: 'success', description: '钱包充值' },
  { id: 'TXN-20260606-020', type: 'payment', date: new Date('2026-06-06T16:10:00'), orderId: 'LLI-20260606-020', amount: -360.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260606-021', type: 'payment', date: new Date('2026-06-06T13:45:00'), orderId: 'LLI-20260606-021', amount: -240.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },

  // ── 2026-06-05 ──
  { id: 'TXN-20260605-022', type: 'payment', date: new Date('2026-06-05T17:20:00'), orderId: 'LLI-20260605-022', amount: -520.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260605-023', type: 'payment', date: new Date('2026-06-05T14:05:00'), orderId: 'LLI-20260605-023', amount: -345.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260605-024', type: 'refund',  date: new Date('2026-06-05T10:30:00'), orderId: 'LLI-20260604-025', amount: 310.00,  status: 'success', description: '订单退款', subAccountId: 'E001-VN' },

  // ── 2026-06-04 ──
  { id: 'TXN-20260604-025', type: 'payment', date: new Date('2026-06-04T16:35:00'), orderId: 'LLI-20260604-025', amount: -310.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260604-026', type: 'payment', date: new Date('2026-06-04T13:50:00'), orderId: 'LLI-20260604-026', amount: -385.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260604-027', type: 'payment', date: new Date('2026-06-04T10:25:00'), orderId: 'LLI-20260604-027', amount: -430.00, status: 'success', description: '订单支付' },

  // ── 2026-06-03 ──
  { id: 'TXN-20260603-028', type: 'payment', date: new Date('2026-06-03T15:40:00'), orderId: 'LLI-20260603-028', amount: -290.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260603-029', type: 'payment', date: new Date('2026-06-03T11:15:00'), orderId: 'LLI-20260603-029', amount: -375.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },

  // ── 2026-06-02 ──
  { id: 'TXN-20260602-030', type: 'topup',   date: new Date('2026-06-02T10:00:00'), orderId: undefined,           amount: 4000.00, status: 'success', description: '钱包充值' },
  { id: 'TXN-20260602-031', type: 'payment', date: new Date('2026-06-02T16:00:00'), orderId: 'LLI-20260602-031', amount: -460.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260602-032', type: 'payment', date: new Date('2026-06-02T13:20:00'), orderId: 'LLI-20260602-032', amount: -315.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260602-033', type: 'payment', date: new Date('2026-06-02T10:50:00'), orderId: 'LLI-20260602-033', amount: -270.00, status: 'success', description: '订单支付' },

  // ── 2026-06-01 ──
  { id: 'TXN-20260601-034', type: 'payment', date: new Date('2026-06-01T17:15:00'), orderId: 'LLI-20260601-034', amount: -395.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260601-035', type: 'payment', date: new Date('2026-06-01T14:30:00'), orderId: 'LLI-20260601-035', amount: -250.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260601-036', type: 'refund',  date: new Date('2026-06-01T11:00:00'), orderId: 'LLI-20260531-037', amount: 220.00,  status: 'success', description: '订单退款', subAccountId: 'E001-TH' },

  // ── 2026-05-31 ──
  { id: 'TXN-20260531-037', type: 'payment', date: new Date('2026-05-31T16:50:00'), orderId: 'LLI-20260531-037', amount: -220.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260531-038', type: 'payment', date: new Date('2026-05-31T13:25:00'), orderId: 'LLI-20260531-038', amount: -440.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260531-039', type: 'payment', date: new Date('2026-05-31T09:55:00'), orderId: 'LLI-20260531-039', amount: -305.00, status: 'success', description: '订单支付' },

  // ── 2026-05-29 ──
  { id: 'TXN-20260529-040', type: 'payment', date: new Date('2026-05-29T15:10:00'), orderId: 'LLI-20260529-040', amount: -335.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260529-041', type: 'payment', date: new Date('2026-05-29T11:40:00'), orderId: 'LLI-20260529-041', amount: -415.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },

  // ── 2026-05-27 ──
  { id: 'TXN-20260527-042', type: 'topup',   date: new Date('2026-05-27T10:00:00'), orderId: undefined,           amount: 3500.00, status: 'success', description: '钱包充值' },
  { id: 'TXN-20260527-043', type: 'payment', date: new Date('2026-05-27T16:30:00'), orderId: 'LLI-20260527-043', amount: -285.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260527-044', type: 'payment', date: new Date('2026-05-27T13:00:00'), orderId: 'LLI-20260527-044', amount: -360.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260527-045', type: 'payment', date: new Date('2026-05-27T10:20:00'), orderId: 'LLI-20260527-045', amount: -490.00, status: 'success', description: '订单支付' },

  // ── 2026-05-25 ──
  { id: 'TXN-20260525-046', type: 'payment', date: new Date('2026-05-25T14:45:00'), orderId: 'LLI-20260525-046', amount: -370.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260525-047', type: 'payment', date: new Date('2026-05-25T10:30:00'), orderId: 'LLI-20260525-047', amount: -245.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },

  // ── 2026-05-23 ──
  { id: 'TXN-20260523-048', type: 'payment', date: new Date('2026-05-23T15:55:00'), orderId: 'LLI-20260523-048', amount: -505.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260523-049', type: 'payment', date: new Date('2026-05-23T12:10:00'), orderId: 'LLI-20260523-049', amount: -295.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260523-050', type: 'refund',  date: new Date('2026-05-23T09:30:00'), orderId: 'LLI-20260522-051', amount: 340.00,  status: 'success', description: '订单退款' },

  // ── 2026-05-20 ──
  { id: 'TXN-20260520-051', type: 'topup',   date: new Date('2026-05-20T10:00:00'), orderId: undefined,           amount: 5000.00, status: 'success', description: '钱包充值' },
  { id: 'TXN-20260520-052', type: 'payment', date: new Date('2026-05-20T16:25:00'), orderId: 'LLI-20260520-052', amount: -430.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260520-053', type: 'payment', date: new Date('2026-05-20T13:50:00'), orderId: 'LLI-20260520-053', amount: -320.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260520-054', type: 'payment', date: new Date('2026-05-20T10:10:00'), orderId: 'LLI-20260520-054', amount: -260.00, status: 'success', description: '订单支付' },

  // ── 2026-05-17 ──
  { id: 'TXN-20260517-055', type: 'payment', date: new Date('2026-05-17T15:30:00'), orderId: 'LLI-20260517-055', amount: -385.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260517-056', type: 'payment', date: new Date('2026-05-17T11:45:00'), orderId: 'LLI-20260517-056', amount: -475.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },

  // ── 2026-05-14 ──
  { id: 'TXN-20260514-057', type: 'payment', date: new Date('2026-05-14T16:00:00'), orderId: 'LLI-20260514-057', amount: -350.00, status: 'success', description: '订单支付', subAccountId: 'E001-VN' },
  { id: 'TXN-20260514-058', type: 'payment', date: new Date('2026-05-14T13:15:00'), orderId: 'LLI-20260514-058', amount: -410.00, status: 'success', description: '订单支付', subAccountId: 'E001-TH' },
  { id: 'TXN-20260514-059', type: 'topup',   date: new Date('2026-05-14T10:00:00'), orderId: undefined,           amount: 3000.00, status: 'success', description: '钱包充值' },
];

// 用户资料
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  language: 'zh' | 'en';
}

export const mockUserProfile: UserProfile = {
  id: 'USER-001',
  firstName: '张',
  lastName: '三',
  phone: '+852 6312345678',
  email: 'zhangsan@example.com',
  city: 'hongkong',
  language: 'zh',
};

// 通知设置
export interface NotificationSettings {
  promotions: {
    sms: boolean;
    email: boolean;
  };
  orderUpdates: {
    browser: boolean;
  };
}

export const mockNotificationSettings: NotificationSettings = {
  promotions: {
    sms: true,
    email: true,
  },
  orderUpdates: {
    browser: false,
  },
};

// 订单设置
export interface OrderSettings {
  electronicReceipt: boolean;
  receiptEmail: string;
  deliveryProof: boolean;
}

export const mockOrderSettings: OrderSettings = {
  electronicReceipt: true,
  receiptEmail: 'zhangsan@example.com',
  deliveryProof: true,
};

// ============================================
// 母子账号（Demo 原型）
// ============================================
// 说明：本段为母子账号功能演示用的 mock 数据，全部为前端模拟，无真实接口。
// 金额统一 CNY（与账期余额口径一致，见 CLAUDE.md 货币规则）。

export type AccountType = 'parent' | 'child' | 'normal';

/** 当前登录账号（写入 localStorage 'currentAccount'） */
export interface CurrentAccount {
  accountType: AccountType;
  accountId: string;       // 账号唯一标识
  companyName: string;     // 企业名称（导航栏展示）
  subAccountName?: string; // 子账号名称，仅 child 类型有
  parentId?: string;       // 所属母账号 id，仅 child 类型有
}

export type SubAccountStatus = 'active' | 'disabled';

/** 子账号 */
export interface SubAccount {
  id: string;
  name: string;            // 账号名称（如「越南子账号」）
  phone: string;           // 登录手机号
  quota: number;           // 已分配额度（CNY）
  balance: number;         // 当前余额（CNY）
  status: SubAccountStatus;
  createdAt: string;       // 创建时间
}

/** 母账号企业名称（与 Navbar、运营后台保持一致） */
export const PARENT_COMPANY_NAME = '菜鸟物流国际';

/** 母账号 id（与运营后台 enterprises 中的母账号对应） */
export const PARENT_ACCOUNT_ID = 'E001';

/** 三个预设账号，用于登录页角色选择与 Navbar debug 切换 */
export const accountPresets: Record<string, CurrentAccount> = {
  parent: {
    accountType: 'parent',
    accountId: PARENT_ACCOUNT_ID,
    companyName: PARENT_COMPANY_NAME,
  },
  childVN: {
    accountType: 'child',
    accountId: 'E001-VN',
    companyName: PARENT_COMPANY_NAME,
    subAccountName: '越南子账号',
    parentId: PARENT_ACCOUNT_ID,
  },
  childTH: {
    accountType: 'child',
    accountId: 'E001-TH',
    companyName: PARENT_COMPANY_NAME,
    subAccountName: '泰国子账号',
    parentId: PARENT_ACCOUNT_ID,
  },
};

/** 母账号下的子账号列表（演示数据） */
export const mockSubAccounts: SubAccount[] = [
  {
    id: 'E001-VN',
    name: '越南子账号',
    phone: '+84 901234567',
    quota: 5000,
    balance: 3200,
    status: 'active',
    createdAt: '2026-03-01',
  },
  {
    id: 'E001-TH',
    name: '泰国子账号',
    phone: '+66 812345678',
    quota: 2000,
    balance: 320,
    status: 'disabled',
    createdAt: '2026-03-12',
  },
];

/** 母账号额度总览（CNY） */
export interface ParentQuota {
  total: number;     // 总额度上限
  allocated: number; // 已分配给子账号的额度之和
  remaining: number; // 剩余可分配额度
}

export const mockParentQuota: ParentQuota = {
  total: 15000,
  allocated: 7000, // 5000 + 2000
  remaining: 8000,
};

/**
 * 读取当前登录账号。
 * 浏览器端从 localStorage 读取 'currentAccount'，读不到时默认母账号。
 * 服务端渲染阶段返回母账号默认值。
 */
export function getCurrentAccount(): CurrentAccount {
  if (typeof window === 'undefined') return accountPresets.parent;
  try {
    const raw = window.localStorage.getItem('currentAccount');
    if (raw) return JSON.parse(raw) as CurrentAccount;
  } catch {
    // 解析失败时回退默认值
  }
  return accountPresets.parent;
}
