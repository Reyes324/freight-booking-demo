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
  status: OrderStatus;
  actualPickupTime?: Date;
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
  priceAdjustment?: PriceAdjustment;
}

// ── Mock Orders Data ──
export const mockOrders: Order[] = [
  {
    orderId: 'ORD-1710681234567',
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
    createdAt: new Date(),
  },
  {
    orderId: 'ORD-1710667890123',
    status: 'in_transit',
    pickup: {
      address: '曼谷是隆路中央世界商业中心',
      contactName: '王先生',
      phone: '+66 834 567 890',
      lat: 13.7472,
      lng: 100.5399,
    },
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
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    driver: {
      name: '张师傅',
      phone: '+852 6789 0123',
      vehiclePlate: 'AB 1234',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.85,
    },
  },
  {
    orderId: 'ORD-1710660000000',
    status: 'delivering',
    pickup: {
      address: '曼谷拉差达披色路The Street商场',
      contactName: '周先生',
      phone: '+66 856 789 012',
      unit: '地下B铺',
      lat: 13.7650,
      lng: 100.5746,
    },
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
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
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
    orderId: 'ORD-1710654567890',
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
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
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
    orderId: 'ORD-1710641234567',
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
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
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

// Mock 交易记录（金额为泰铢）
export const mockTransactions: Transaction[] = [
  {
    id: 'TXN-20260315-001',
    type: 'payment',
    date: new Date('2026-03-15T14:30:00'),
    orderId: 'ORD-20260315-001',
    amount: -220.00,
    status: 'success',
    description: '订单支付',
  },
  {
    id: 'TXN-20260314-002',
    type: 'topup',
    date: new Date('2026-03-14T10:15:00'),
    orderId: undefined,
    amount: 1500.00,
    status: 'success',
    description: '钱包充值',
  },
  {
    id: 'TXN-20260313-003',
    type: 'payment',
    date: new Date('2026-03-13T16:45:00'),
    orderId: 'ORD-20260313-002',
    amount: -360.00,
    status: 'success',
    description: '订单支付',
  },
  {
    id: 'TXN-20260312-004',
    type: 'refund',
    date: new Date('2026-03-12T09:20:00'),
    orderId: 'ORD-20260311-003',
    amount: 220.00,
    status: 'success',
    description: '订单退款',
  },
  {
    id: 'TXN-20260310-005',
    type: 'payment',
    date: new Date('2026-03-10T13:00:00'),
    orderId: 'ORD-20260310-004',
    amount: -285.00,
    status: 'success',
    description: '订单支付',
  },
  {
    id: 'TXN-20260308-006',
    type: 'topup',
    date: new Date('2026-03-08T11:30:00'),
    orderId: undefined,
    amount: 3000.00,
    status: 'success',
    description: '钱包充值',
  },
  {
    id: 'TXN-20260305-007',
    type: 'payment',
    date: new Date('2026-03-05T15:20:00'),
    orderId: 'ORD-20260305-005',
    amount: -265.00,
    status: 'success',
    description: '订单支付',
  },
  {
    id: 'TXN-20260302-008',
    type: 'payment',
    date: new Date('2026-03-02T10:45:00'),
    orderId: 'ORD-20260302-006',
    amount: -315.00,
    status: 'success',
    description: '订单支付',
  },
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
