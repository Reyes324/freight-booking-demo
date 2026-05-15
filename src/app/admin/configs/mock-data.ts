// Mock data for Config Center demo
// This file is the source of truth for initial configuration data.

// ─── Error Code Types ─────────────────────────────────────────────────────────

export type ErrorCodeCategory = 'general' | 'user' | 'order' | 'lalamove';

export interface ErrorCode {
  id: string;
  code: number;
  enumName: string;
  key: string;
  originalDesc: string;
  zhTip: string;
  enTip: string;
  scenario: string;
  category: ErrorCodeCategory;
}

export function getCategory(code: number): ErrorCodeCategory {
  if (code >= 10001 && code <= 10005) return 'user';
  if (code >= 20001 && code <= 21010) return 'order';
  if (code >= 23001 && code <= 23030) return 'lalamove';
  return 'general';
}

export const CATEGORY_LABELS: Record<ErrorCodeCategory, string> = {
  general: '通用错误 (9001~9012)',
  user: '用户服务错误 (10001~10005)',
  order: '订单相关错误 (20001~21010)',
  lalamove: 'LALAMOVE 供应商错误 (23001~23030)',
};

export const INITIAL_ERROR_CODES: ErrorCode[] = [
  // 通用错误
  { id: 'ec-0',    code: 0,     enumName: 'SUCCESS',             key: 'svc.success',           originalDesc: 'success',                         zhTip: '操作成功',                     enTip: 'Success',                                              scenario: '请求正常处理并返回，无需用户额外操作',             category: 'general' },
  { id: 'ec-1',    code: 9001,  enumName: 'VALIDATE_FAIL',       key: 'svc.validate.failed',   originalDesc: 'Request parameter validation failed', zhTip: '请求参数有误，请检查后重试',  enTip: 'Invalid request. Please check your input and try again.', scenario: '提交的字段格式或值不符合要求，如类型错误、缺少必填项等', category: 'general' },
  { id: 'ec-2',    code: 9002,  enumName: 'SYSTEM_BUSY',         key: 'system.busy',           originalDesc: 'System busy',                     zhTip: '系统繁忙，请稍后再试',         enTip: 'The system is busy. Please try again in a moment.',    scenario: '服务端当前负载过高，建议提示用户稍等片刻后重试',    category: 'general' },
  { id: 'ec-3',    code: 9003,  enumName: 'SYSTEM_ERROR',        key: 'svc.error',             originalDesc: 'Service is not available',        zhTip: '服务暂时不可用，请稍后重试',   enTip: 'Service temporarily unavailable. Please try again later.', scenario: '服务端发生未知异常，需排查后端日志，不应将技术细节暴露给用户', category: 'general' },
  { id: 'ec-4',    code: 9004,  enumName: 'USER_NO_LOGIN_ERR',   key: 'common.user.login.err', originalDesc: 'User not logged in',              zhTip: '请先登录后再操作',             enTip: 'Please log in to continue.',                           scenario: '用户未登录或登录态已过期，需引导重新登录',          category: 'general' },
  { id: 'ec-5',    code: 9005,  enumName: 'DATA_NOT_EXIST',      key: 'data.not.exist',        originalDesc: 'Data not found',                  zhTip: '相关数据不存在，请刷新后重试', enTip: "The requested data doesn\'t exist. Please refresh and try again.", scenario: '查询或操作的目标数据在系统中找不到，可能已被删除或 ID 有误', category: 'general' },
  { id: 'ec-6',    code: 9006,  enumName: 'LALAPLAT_CONFIG_ERR', key: 'apollo.config.error',   originalDesc: 'Apollo config error',             zhTip: '系统配置异常，请联系客服',     enTip: 'System configuration error. Please contact support.',  scenario: '后端配置中心配置缺失或错误，属于运维/开发问题，不应将技术细节暴露给用户', category: 'general' },
  // 用户服务错误
  { id: 'ec-7',    code: 10001, enumName: 'USER_NOT_FOUND',      key: 'user.not.found',        originalDesc: 'User not found',                  zhTip: '用户不存在，请检查后重试',     enTip: 'User not found. Please check and try again.',          scenario: '按用户 ID 或手机号查询时找不到对应记录',            category: 'user'    },
  { id: 'ec-8',    code: 10002, enumName: 'USER_ALREADY_EXISTS', key: 'user.already.exists',   originalDesc: 'User already exists',             zhTip: '该账号已注册，请直接登录',     enTip: 'This account already exists. Please log in directly.', scenario: '注册时手机号或邮箱已被使用',                         category: 'user'    },
  { id: 'ec-9',    code: 10003, enumName: 'USER_DISABLED',       key: 'user.disabled',         originalDesc: 'User account is disabled',        zhTip: '账号已被禁用，请联系客服',     enTip: 'Your account has been disabled. Please contact support.', scenario: '用户账号被运营或风控标记为禁用状态',                 category: 'user'    },
  // 订单相关错误
  { id: 'ec-10',   code: 20001, enumName: 'ORDER_NOT_FOUND',     key: 'order.not.found',       originalDesc: 'Order not found',                 zhTip: '订单不存在，请刷新后重试',     enTip: 'Order not found. Please refresh and try again.',       scenario: '按订单号查询时找不到对应记录',                       category: 'order'   },
  { id: 'ec-11',   code: 20002, enumName: 'ORDER_EXPIRED',       key: 'order.expired',         originalDesc: 'Order has expired',               zhTip: '订单已过期，请重新下单',       enTip: 'This order has expired. Please place a new order.',    scenario: '用户尝试操作一个已超时的待支付订单',                 category: 'order'   },
  { id: 'ec-12',   code: 20003, enumName: 'ORDER_CANCEL_FAIL',   key: 'order.cancel.fail',     originalDesc: 'Order cancellation failed',       zhTip: '取消订单失败，请稍后重试',     enTip: 'Failed to cancel the order. Please try again later.',  scenario: '取消请求发出后 Lalamove 返回失败，可能订单状态已变更', category: 'order'   },
  // LALAMOVE 供应商错误
  { id: 'ec-13',   code: 23001, enumName: 'LLM_AUTH_FAIL',       key: 'llm.auth.fail',         originalDesc: 'Lalamove authentication failed',  zhTip: '服务暂时不可用，请联系客服',   enTip: 'Service unavailable. Please contact support.',         scenario: 'Lalamove API 鉴权失败，属于系统配置问题，不应暴露给用户', category: 'lalamove' },
  { id: 'ec-14',   code: 23002, enumName: 'LLM_QUOTA_EXCEED',    key: 'llm.quota.exceed',      originalDesc: 'Lalamove quota exceeded',         zhTip: '当前运力紧张，请稍后重试',     enTip: 'High demand right now. Please try again shortly.',     scenario: 'Lalamove 接口调用量超限，通常为短暂高峰',            category: 'lalamove' },
  { id: 'ec-15',   code: 23003, enumName: 'LLM_VEHICLE_UNAVAIL', key: 'llm.vehicle.unavailable', originalDesc: 'Vehicle type not available',    zhTip: '所选车型暂无运力，请更换车型重试', enTip: 'Selected vehicle type is currently unavailable. Please try another.', scenario: '所选车型在该城市或时段无可用运力', category: 'lalamove' },
];

// ─── Vehicle Types ─────────────────────────────────────────────────────────────

export interface SpecialRequest {
  name: string;
  parent_type: string;
  parent_enName: string;
  parent_zhName: string;
  enName: string;
  zhName: string;
}

export interface Vehicle {
  key: string;
  enName: string;
  zhName: string;
  enDesc: string;
  zhDesc: string;
  imageUrl: string;
  specialRequests: SpecialRequest[];
}

export type VehicleData = Record<string, Record<string, Vehicle[]>>;

export const MARKET_FLAGS: Record<string, string> = {
  Indonesia: '🇮🇩',
  Malaysia: '🇲🇾',
  Thailand: '🇹🇭',
  Vietnam: '🇻🇳',
};

export const INITIAL_VEHICLE_DATA: VehicleData = {
  "Indonesia": {
    "Bandung": [
      {
        "key": "CDDBAK",
        "enName": "CDD Bak (5 Ton)",
        "zhName": "CDD平板车（5吨）",
        "enDesc": "Ideal for large and bulky goods, and huge materials",
        "zhDesc": "适合大型笨重货物及大宗材料配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1fbc7d8f-9e50-55af-2758-872de494a716.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "CDDBOX",
        "enName": "CDD Box (5 Ton)",
        "zhName": "CDD厢式货车（5吨）",
        "enDesc": "Ideal for large and bulky goods, and huge materials",
        "zhDesc": "适合大型笨重货物及大宗材料配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "ENGKELBAK",
        "enName": "Engkel Bak (2.5 Ton)",
        "zhName": "Engkel平板车（2.5吨）",
        "enDesc": "Ideal for large and bulky goods, such as moving house",
        "zhDesc": "适合大型笨重货物配送，例如搬家",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1fbc7d8f-9e50-55af-2758-872de494a716.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "ENGKELBOX",
        "enName": "Engkel Box (2 Ton)",
        "zhName": "Engkel厢式货车（2吨）",
        "enDesc": "Ideal for bulk and big items and house moving",
        "zhDesc": "适合大批量大件货物及搬家",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "WAITING_TIME_030MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 30 min",
            "zhName": "最多30分钟"
          },
          {
            "name": "WAITING_TIME_060MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 60 min",
            "zhName": "最多60分钟"
          },
          {
            "name": "WAITING_TIME_090MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 90 min",
            "zhName": "最多90分钟"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          }
        ]
      }
    ],
    "Jakarta": [
      {
        "key": "CDDBAK",
        "enName": "CDD Bak (5 Ton)",
        "zhName": "CDD平板车（5吨）",
        "enDesc": "Ideal for large and bulky goods, and huge materials",
        "zhDesc": "适合大型笨重货物及大宗材料配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1fbc7d8f-9e50-55af-2758-872de494a716.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "CDDBOX",
        "enName": "CDD Box (5 Ton)",
        "zhName": "CDD厢式货车（5吨）",
        "enDesc": "Ideal for large and bulky goods, and huge materials",
        "zhDesc": "适合大型笨重货物及大宗材料配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "ENGKELBAK",
        "enName": "Engkel Bak (2.5 Ton)",
        "zhName": "Engkel平板车（2.5吨）",
        "enDesc": "Ideal for large and bulky goods, such as moving house",
        "zhDesc": "适合大型笨重货物配送，例如搬家",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1fbc7d8f-9e50-55af-2758-872de494a716.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "ENGKELBOX",
        "enName": "Engkel Box (2 Ton)",
        "zhName": "Engkel厢式货车（2吨）",
        "enDesc": "Ideal for bulk and big items delivery including house moving",
        "zhDesc": "适合大批量大件货物配送，包括搬家",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      }
    ],
    "Cirebon": [
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Express delivery for small goods",
        "zhDesc": "小件货物快速配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          {
            "name": "THERMAL_BAG_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "LALABAG",
            "zhName": "Lalabag保温袋"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (pickup & drop off by driver)",
            "zhName": "上门取件及派送（司机操作）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          }
        ]
      },
      {
        "key": "MPV",
        "enName": "MPV",
        "zhName": "MPV",
        "enDesc": "Ideal for delicate goods including electronics",
        "zhDesc": "适合精密货物配送，包括电子产品",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/162abd3e-8e8b-a94c-9f41-e76e845fa55d.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_3",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Surabaya",
            "zhName": "前往泗水"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          }
        ]
      },
      {
        "key": "SEDAN",
        "enName": "Sedan",
        "zhName": "轿车",
        "enDesc": "Ideal for small to medium item size and fragile goods",
        "zhDesc": "适合中小型货物及易碎品配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "WAITING_TIME_030MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 30 min",
            "zhName": "最多30分钟"
          },
          {
            "name": "WAITING_TIME_060MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 60 min",
            "zhName": "最多60分钟"
          },
          {
            "name": "WAITING_TIME_090MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 90 min",
            "zhName": "最多90分钟"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          }
        ]
      },
      {
        "key": "TRUCK175",
        "enName": "Pickup Bak",
        "zhName": "皮卡平板车",
        "enDesc": "Ideal for special size goods delivery including building material",
        "zhDesc": "适合特殊尺寸货物配送，包括建筑材料",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/16d4ffc1-438d-6827-3497-d5a6d2a78dad.png",
        "specialRequests": [
          {
            "name": "WAITING_TIME_030MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 30 min",
            "zhName": "最多30分钟"
          },
          {
            "name": "WAITING_TIME_060MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 60 min",
            "zhName": "最多60分钟"
          },
          {
            "name": "WAITING_TIME_090MIN",
            "parent_type": "How much extra time is needed?",
            "parent_enName": "How much extra time is needed?",
            "parent_zhName": "额外等待时间",
            "enName": "Up to 90 min",
            "zhName": "最多90分钟"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          }
        ]
      }
    ],
    "Surabaya": [
      {
        "key": "CDDBAK",
        "enName": "CDD Bak (5 Ton)",
        "zhName": "CDD平板车（5吨）",
        "enDesc": "Ideal for large and bulky goods, and huge materials",
        "zhDesc": "适合大型笨重货物及大宗材料配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1fbc7d8f-9e50-55af-2758-872de494a716.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "CDDBOX",
        "enName": "CDD Box (5 Ton)",
        "zhName": "CDD厢式货车（5吨）",
        "enDesc": "Ideal for large and bulky goods, and huge materials",
        "zhDesc": "适合大型笨重货物及大宗材料配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "ENGKELBAK",
        "enName": "Engkel Bak (2.5 Ton)",
        "zhName": "Engkel平板车（2.5吨）",
        "enDesc": "Ideal for large and bulky goods, such as moving house",
        "zhDesc": "适合大型笨重货物配送，例如搬家",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1fbc7d8f-9e50-55af-2758-872de494a716.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      },
      {
        "key": "ENGKELBOX",
        "enName": "Engkel Box (2 Ton)",
        "zhName": "Engkel厢式货车（2吨）",
        "enDesc": "Ideal for bulk and big items delivery including house moving",
        "zhDesc": "适合大批量大件货物配送，包括搬家",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE_1",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Intra City)",
            "zhName": "城内过路费"
          },
          {
            "name": "TOLL_FEE_8",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Jakarta",
            "zhName": "前往雅加达"
          },
          {
            "name": "TOLL_FEE_2",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Bandung",
            "zhName": "前往万隆"
          },
          {
            "name": "TOLL_FEE_4",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Malang",
            "zhName": "前往玛琅"
          },
          {
            "name": "TOLL_FEE_5",
            "parent_type": "Toll fee",
            "parent_enName": "Toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll to Cirebon",
            "zhName": "前往井里汶"
          }
        ]
      }
    ]
  },
  "Malaysia": {
    "Kuala Lumpur": [
      {
        "key": "4X4",
        "enName": "Pickup (4x4)",
        "zhName": "四驱皮卡",
        "enDesc": "Open or closed cargo boot. Ideal for small boxes and furniture, folding table & chairs.",
        "zhDesc": "开放或封闭货箱，适合小型箱子、家具、折叠桌椅",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/164e1e52-1911-6019-6898-d12b373890c6.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (loading & unloading by driver)",
            "zhName": "上门配送（司机负责装卸）"
          }
        ]
      },
      {
        "key": "CAR",
        "enName": "Car",
        "zhName": "轿车",
        "enDesc": "Ideal for groceries, food, flowers, parcels, fragile goods",
        "zhDesc": "适合日用品、食品、鲜花、包裹及易碎货物",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (loading & unloading by driver)",
            "zhName": "上门配送（司机负责装卸）"
          }
        ]
      },
      {
        "key": "LORRY_10FT",
        "enName": "Small Lorry 10-ft",
        "zhName": "10英尺小型货车",
        "enDesc": "Ideal for small item delivery. Single bed, 2-seater sofa, small dining table.",
        "zhDesc": "适合小件货物配送，如单人床、双人沙发、小餐桌",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER2HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 2 helpers",
            "zhName": "司机 + 2名助手"
          },
          {
            "name": "TAILBOARD_VEHICLE",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Tailgate",
            "zhName": "尾板"
          },
          {
            "name": "HOUSE_MOVING",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (Dismantle   Assemble   Loading with Driver + 2 Helpers)",
            "zhName": "上门服务（拆装 + 司机及2名助手装卸）"
          }
        ]
      },
      {
        "key": "LORRY_14FT",
        "enName": "Medium Lorry 14-ft",
        "zhName": "14英尺中型货车",
        "enDesc": "Medium item delivery. Queen size bed, wardrobe, shelves / rack.",
        "zhDesc": "中型货物配送，如大床、衣柜、货架",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/15a2b3ae-d3d9-b826-8dc1-d4c1819ced54.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER2HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 2 helpers",
            "zhName": "司机 + 2名助手"
          },
          {
            "name": "HOUSE_MOVING",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (Dismantle   Assemble   Loading with Driver + 2 Helpers)",
            "zhName": "上门服务（拆装 + 司机及2名助手装卸）"
          },
          {
            "name": "TAILBOARD_VEHICLE",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Tailgate",
            "zhName": "尾板"
          }
        ]
      }
    ],
    "Johor & Nearby Districts": [
      {
        "key": "4X4",
        "enName": "Pickup (4x4)",
        "zhName": "四驱皮卡",
        "enDesc": "Open or closed cargo boot. Ideal for small boxes and furniture, folding table & chairs.",
        "zhDesc": "开放或封闭货箱，适合小型箱子、家具、折叠桌椅",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/164e1e52-1911-6019-6898-d12b373890c6.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (loading & unloading by driver)",
            "zhName": "上门配送（司机负责装卸）"
          }
        ]
      },
      {
        "key": "CAR",
        "enName": "Car",
        "zhName": "轿车",
        "enDesc": "Ideal for groceries, food, flowers, parcels, fragile goods",
        "zhDesc": "适合日用品、食品、鲜花、包裹及易碎货物",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (loading & unloading by driver)",
            "zhName": "上门配送（司机负责装卸）"
          }
        ]
      },
      {
        "key": "LORRY_10FT",
        "enName": "Small Lorry 10-ft",
        "zhName": "10英尺小型货车",
        "enDesc": "Ideal for small item delivery. Single bed, 2-seater sofa, small dining table.",
        "zhDesc": "适合小件货物配送，如单人床、双人沙发、小餐桌",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER2HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 2 helpers",
            "zhName": "司机 + 2名助手"
          }
        ]
      },
      {
        "key": "LORRY_14FT",
        "enName": "Medium Lorry 14-ft",
        "zhName": "14英尺中型货车",
        "enDesc": "Medium item delivery. Queen size bed, wardrobe, shelves / rack.",
        "zhDesc": "中型货物配送，如大床、衣柜、货架",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/15a2b3ae-d3d9-b826-8dc1-d4c1819ced54.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER2HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 2 helpers",
            "zhName": "司机 + 2名助手"
          }
        ]
      }
    ],
    "Penang & Nearby States": [
      {
        "key": "4X4",
        "enName": "Pickup (4x4)",
        "zhName": "四驱皮卡",
        "enDesc": "Open or closed cargo boot. Ideal for small boxes and furniture, folding table & chairs.",
        "zhDesc": "开放或封闭货箱，适合小型箱子、家具、折叠桌椅",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/164e1e52-1911-6019-6898-d12b373890c6.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (loading & unloading by driver)",
            "zhName": "上门配送（司机负责装卸）"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Penang Bridge Toll",
            "zhName": "槟城大桥通行费"
          }
        ]
      },
      {
        "key": "CAR",
        "enName": "Car",
        "zhName": "轿车",
        "enDesc": "Ideal for groceries, food, flowers, parcels, fragile goods",
        "zhDesc": "适合日用品、食品、鲜花、包裹及易碎货物",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (loading & unloading by driver)",
            "zhName": "上门配送（司机负责装卸）"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Penang Bridge Toll",
            "zhName": "槟城大桥通行费"
          }
        ]
      },
      {
        "key": "LORRY_10FT",
        "enName": "Small Lorry 10-ft",
        "zhName": "10英尺小型货车",
        "enDesc": "Ideal for small item delivery. Single bed, 2-seater sofa, small dining table.",
        "zhDesc": "适合小件货物配送，如单人床、双人沙发、小餐桌",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER2HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 2 helpers",
            "zhName": "司机 + 2名助手"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Penang Bridge Toll",
            "zhName": "槟城大桥通行费"
          }
        ]
      },
      {
        "key": "LORRY_14FT",
        "enName": "Medium Lorry 14-ft",
        "zhName": "14英尺中型货车",
        "enDesc": "Medium item delivery. Queen size bed, wardrobe, shelves / rack.",
        "zhDesc": "中型货物配送，如大床、衣柜、货架",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/15a2b3ae-d3d9-b826-8dc1-d4c1819ced54.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER2HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver + 2 helpers",
            "zhName": "司机 + 2名助手"
          },
          {
            "name": "TOLL_FEE_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Penang Bridge Toll",
            "zhName": "槟城大桥通行费"
          }
        ]
      }
    ]
  },
  "Thailand": {
    "Bangkok": [
      {
        "key": "BOX_TRUCK_JUMBO",
        "enName": "Box Truck Jumbo",
        "zhName": "加大厢式货车",
        "enDesc": "Suitable for House-Moving, Event Materials, Construction Materials",
        "zhDesc": "适合搬家、活动物料及建筑材料运输",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver only",
            "zhName": "仅司机"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "How many people do you need?",
            "parent_enName": "How many people do you need?",
            "parent_zhName": "所需人数",
            "enName": "Driver   1 helper",
            "zhName": "司机 + 1名助手"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round trip",
            "zhName": "来回程"
          }
        ]
      },
      {
        "key": "CAR",
        "enName": "Sedan",
        "zhName": "轿车",
        "enDesc": "Suitable for F&B, Balloon, Flower & Cakes, Small Parcels",
        "zhDesc": "适合食品饮料、气球、鲜花蛋糕及小件包裹配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "CASH_ON_DELIVERY_AUTODEDUCT",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "CASH_ON_DELIVERY_AUTODEDUCT",
            "zhName": "货到付款（自动扣除）"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          }
        ]
      },
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Suitable for F&B, Documents, Small Parcels",
        "zhDesc": "适合食品饮料、文件及小件货物配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          {
            "name": "CASH_ON_DELIVERY_AUTODEDUCT",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "CASH_ON_DELIVERY_AUTODEDUCT",
            "zhName": "货到付款（自动扣除）"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          },
          {
            "name": "DOCUMENT_HANDLING",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Document handling",
            "zhName": "文件处理"
          },
          {
            "name": "FOOD_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Food Delivery Box",
            "zhName": "食品配送箱"
          }
        ]
      },
      {
        "key": "MOTORCYCLE_RENTAL",
        "enName": "Motorcycle (Rental - 4 Hours)",
        "zhName": "摩托车（租用-4小时）",
        "enDesc": "Suitable for F&B, Documents, Small Parcels",
        "zhDesc": "适合食品饮料、文件及小件货物配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1bc66c80-84f2-9532-476b-899b20892f4b.png",
        "specialRequests": [
          {
            "name": "RENTAL_TIME_5HR",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Extra rental time (5 hr)",
            "zhName": "额外租用时间（5小时）"
          },
          {
            "name": "THERMAL_BAG_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Thermal bag",
            "zhName": "保温袋"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          }
        ]
      }
    ],
    "Chonburi": [
      {
        "key": "CAR",
        "enName": "Sedan",
        "zhName": "轿车",
        "enDesc": "Suitable for F&B, Balloon, Flower & Cakes, Small Parcels",
        "zhDesc": "适合食品饮料、气球、鲜花蛋糕及小件包裹配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "CASH_ON_DELIVERY_AUTODEDUCT",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "CASH_ON_DELIVERY_AUTODEDUCT",
            "zhName": "货到付款（自动扣除）"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          }
        ]
      },
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Suitable for F&B, Documents, Small Parcels",
        "zhDesc": "适合食品饮料、文件及小件货物配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          {
            "name": "CASH_ON_DELIVERY_AUTODEDUCT",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "CASH_ON_DELIVERY_AUTODEDUCT",
            "zhName": "货到付款（自动扣除）"
          },
          {
            "name": "FOOD_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Food Delivery Box",
            "zhName": "食品配送箱"
          },
          {
            "name": "THERMAL_BAG_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Thermal bag",
            "zhName": "保温袋"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          }
        ]
      },
      {
        "key": "MPV",
        "enName": "Hatchback",
        "zhName": "两厢车",
        "enDesc": "Suitable for F&B, Balloon, Flower & Cakes, Small Parcels",
        "zhDesc": "适合食品饮料、气球、鲜花蛋糕及小件包裹配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/16105529-1a0d-2155-efef-262837cc0e8a.png",
        "specialRequests": [
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          }
        ]
      },
      {
        "key": "PICK_UP_TRUCK",
        "enName": "Pickup Truck",
        "zhName": "皮卡",
        "enDesc": "Suitable for Vegetables, Fruits, Construction Materials, Automotive parts",
        "zhDesc": "适合蔬果、建筑材料及汽车配件运输",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/164e1e52-1911-6019-6898-d12b373890c6.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          },
          {
            "name": "DOCUMENT_HANDLING",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Document handling",
            "zhName": "文件处理"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round Trip",
            "zhName": "往返"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash on Delivery (COD)",
            "zhName": "货到付款（COD）"
          }
        ]
      }
    ],
    "Khon Kaen": [
      {
        "key": "CAR",
        "enName": "Sedan",
        "zhName": "轿车",
        "enDesc": "Suitable for F&B, Balloon, Flower & Cakes, Small Parcels",
        "zhDesc": "适合食品饮料、气球、鲜花蛋糕及小件包裹配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/17cc43da-6545-2e52-7691-a7a5ff2b22ec.png",
        "specialRequests": [
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash-On-Delivery (Goods)",
            "zhName": "货到付款（货物）"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round trip",
            "zhName": "来回程"
          }
        ]
      },
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Suitable for F&B, Documents, Small Parcels",
        "zhDesc": "适合食品饮料、文件及小件货物配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round trip",
            "zhName": "来回程"
          },
          {
            "name": "THERMAL_BAG_1",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Thermal bag",
            "zhName": "保温袋"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash-On-Delivery (Goods)",
            "zhName": "货到付款（货物）"
          },
          {
            "name": "QUEUEING_SERVICE",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Extra waiting time (mailing service)",
            "zhName": "额外等待时间（邮寄服务）"
          },
          {
            "name": "DOCUMENT_HANDLING",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Document handling",
            "zhName": "文件处理"
          }
        ]
      },
      {
        "key": "PICK_UP_TRUCK",
        "enName": "Pickup Truck",
        "zhName": "皮卡",
        "enDesc": "Suitable for Vegetables, Fruits, Construction Materials, Automotive parts",
        "zhDesc": "适合蔬果、建筑材料及汽车配件运输",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/164e1e52-1911-6019-6898-d12b373890c6.png",
        "specialRequests": [
          {
            "name": "DOCUMENT_HANDLING",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Document handling",
            "zhName": "文件处理"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          },
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round trip",
            "zhName": "来回程"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash-On-Delivery (Goods)",
            "zhName": "货到付款（货物）"
          }
        ]
      },
      {
        "key": "SUV",
        "enName": "SUV",
        "zhName": "SUV",
        "enDesc": "Suitable for F&B, Balloon, Flower & Cakes, Small Parcels",
        "zhDesc": "适合食品饮料、气球、鲜花蛋糕及小件包裹配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/162abd3e-8e8b-a94c-9f41-e76e845fa55d.png",
        "specialRequests": [
          {
            "name": "ROUND_TRIP",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Round trip",
            "zhName": "来回程"
          },
          {
            "name": "CASH_ON_DELIVERY",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Cash-On-Delivery (Goods)",
            "zhName": "货到付款（货物）"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "",
            "parent_enName": "",
            "parent_zhName": "",
            "enName": "Door-to-door (by driver)",
            "zhName": "上门配送（司机操作）"
          }
        ]
      }
    ]
  },
  "Vietnam": {
    "Ho Chi Minh City and Nearby Regions": [
      {
        "key": "1000KG_TRUCK_RENTAL",
        "enName": "Truck 1000 kg (Rental - 3 Hours)",
        "zhName": "1000公斤货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1c7ea67f-4fcb-6c05-e388-1ed1ef570cf0.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          },
          {
            "name": "LOADING_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Loading and unloading by extra helper",
            "zhName": "额外助手负责装卸"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by extra helper",
            "zhName": "额外助手上门配送"
          },
          {
            "name": "TARPAULIN",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Tarpaulin",
            "zhName": "篷布车"
          },
          {
            "name": "DROPSIDE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Dropside",
            "zhName": "平板栏板"
          }
        ]
      },
      {
        "key": "1000KG_VAN_RENTAL",
        "enName": "Van 1000 kg (Rental - 3 Hours)",
        "zhName": "1000公斤厢式货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/15b25a25-1cf3-e4a0-348a-6f8d01451e04.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          },
          {
            "name": "LOADING_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Loading and unloading by extra helper",
            "zhName": "额外助手负责装卸"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by extra helper",
            "zhName": "额外助手上门配送"
          },
          {
            "name": "EXTRA_CAPACITY_L_250CM",
            "parent_type": "Please select the service",
            "parent_enName": "Please select the service",
            "parent_zhName": "额外载货空间",
            "enName": "Load Length Over 2.5m",
            "zhName": "货物长度超过2.5米"
          },
          {
            "name": "EXTRA_CAPACITY_L_300CM",
            "parent_type": "Please select the service",
            "parent_enName": "Please select the service",
            "parent_zhName": "额外载货空间",
            "enName": "Load Length Over 3.0m",
            "zhName": "货物长度超过3.0米"
          }
        ]
      },
      {
        "key": "1250KG_TRUCK_RENTAL",
        "enName": "Truck 1250 kg (Rental - 3 Hours)",
        "zhName": "1250公斤货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1c7ea67f-4fcb-6c05-e388-1ed1ef570cf0.png",
        "specialRequests": [
          {
            "name": "TARPAULIN",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Tarpaulin",
            "zhName": "篷布车"
          },
          {
            "name": "DROPSIDE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Dropside",
            "zhName": "平板栏板"
          },
          {
            "name": "COVERED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Closed Box",
            "zhName": "封闭厢式"
          },
          {
            "name": "INSULATED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Insulated Box (20°C to 25°C)",
            "zhName": "隔热箱（20-25°C）"
          },
          {
            "name": "FROZEN_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Frozen Truck (From -5°C)",
            "zhName": "冷冻货车（-5°C起）"
          }
        ]
      },
      {
        "key": "1500KG_TRUCK_RENTAL",
        "enName": "Truck 1500 kg (Rental - 3 Hours)",
        "zhName": "1500公斤货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1c7ea67f-4fcb-6c05-e388-1ed1ef570cf0.png",
        "specialRequests": [
          {
            "name": "TARPAULIN",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Tarpaulin",
            "zhName": "篷布车"
          },
          {
            "name": "DROPSIDE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Dropside",
            "zhName": "平板栏板"
          },
          {
            "name": "COVERED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Closed Box",
            "zhName": "封闭厢式"
          },
          {
            "name": "INSULATED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Insulated Box (20°C to 25°C)",
            "zhName": "隔热箱（20-25°C）"
          },
          {
            "name": "FROZEN_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Frozen Truck (From -5°C)",
            "zhName": "冷冻货车（-5°C起）"
          }
        ]
      }
    ],
    "Hanoi and Nearby Regions": [
      {
        "key": "1000KG_TRUCK_RENTAL",
        "enName": "Truck 1000 kg (Rental - 3 Hours)",
        "zhName": "1000公斤货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1c7ea67f-4fcb-6c05-e388-1ed1ef570cf0.png",
        "specialRequests": [
          {
            "name": "TARPAULIN",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Tarpaulin",
            "zhName": "篷布车"
          },
          {
            "name": "DROPSIDE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Dropside",
            "zhName": "平板栏板"
          },
          {
            "name": "COVERED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Closed Box",
            "zhName": "封闭厢式"
          },
          {
            "name": "INSULATED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Insulated Box (20°C to 25°C)",
            "zhName": "隔热箱（20-25°C）"
          },
          {
            "name": "FROZEN_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Frozen Truck (From -5°C)",
            "zhName": "冷冻货车（-5°C起）"
          }
        ]
      },
      {
        "key": "1000KG_VAN_RENTAL",
        "enName": "Van 1000 kg (Rental - 3 Hours)",
        "zhName": "1000公斤厢式货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/15b25a25-1cf3-e4a0-348a-6f8d01451e04.png",
        "specialRequests": [
          {
            "name": "EXTRA_CAPACITY_L_250CM",
            "parent_type": "Please select the service",
            "parent_enName": "Please select the service",
            "parent_zhName": "额外载货空间",
            "enName": "Load Length Over 2.5m",
            "zhName": "货物长度超过2.5米"
          },
          {
            "name": "EXTRA_CAPACITY_L_300CM",
            "parent_type": "Please select the service",
            "parent_enName": "Please select the service",
            "parent_zhName": "额外载货空间",
            "enName": "Load Length Over 3.0m",
            "zhName": "货物长度超过3.0米"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          },
          {
            "name": "LOADING_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Loading and unloading by extra helper",
            "zhName": "额外助手负责装卸"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by extra helper",
            "zhName": "额外助手上门配送"
          }
        ]
      },
      {
        "key": "1250KG_TRUCK_RENTAL",
        "enName": "Truck 1250 kg (Rental - 3 Hours)",
        "zhName": "1250公斤货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1c7ea67f-4fcb-6c05-e388-1ed1ef570cf0.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          },
          {
            "name": "LOADING_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Loading and unloading by extra helper",
            "zhName": "额外助手负责装卸"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by extra helper",
            "zhName": "额外助手上门配送"
          },
          {
            "name": "RENTAL_TIME_4HR",
            "parent_type": "Please select the option you need",
            "parent_enName": "Please select the option you need",
            "parent_zhName": "租用时长",
            "enName": "An additional 4 hours",
            "zhName": "额外4小时"
          },
          {
            "name": "RENTAL_TIME_6HR",
            "parent_type": "Please select the option you need",
            "parent_enName": "Please select the option you need",
            "parent_zhName": "租用时长",
            "enName": "An additional 6 hours",
            "zhName": "额外6小时"
          }
        ]
      },
      {
        "key": "1500KG_TRUCK_RENTAL",
        "enName": "Truck 1500 kg (Rental - 3 Hours)",
        "zhName": "1500公斤货车（租用-3小时）",
        "enDesc": "Driver Included, Extra Services Excluded",
        "zhDesc": "含司机，不含额外服务",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1c7ea67f-4fcb-6c05-e388-1ed1ef570cf0.png",
        "specialRequests": [
          {
            "name": "TARPAULIN",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Tarpaulin",
            "zhName": "篷布车"
          },
          {
            "name": "DROPSIDE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Dropside",
            "zhName": "平板栏板"
          },
          {
            "name": "COVERED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Closed Box",
            "zhName": "封闭厢式"
          },
          {
            "name": "INSULATED_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Insulated Box (20°C to 25°C)",
            "zhName": "隔热箱（20-25°C）"
          },
          {
            "name": "FROZEN_VEHICLE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Frozen Truck (From -5°C)",
            "zhName": "冷冻货车（-5°C起）"
          }
        ]
      }
    ],
    "Da Nang and Central Provinces": [
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Goods worth up to 3 million VND and no cash on delivery",
        "zhDesc": "适合价值不超过300万越盾、不含货到付款的货物",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          {
            "name": "QUEUEING_SERVICE_015MIN",
            "parent_type": "When you need the driver to queue for picking up order",
            "parent_enName": "When you need the driver to queue for picking up order",
            "parent_zhName": "司机等候时长",
            "enName": "An additional 15 minutes",
            "zhName": "额外15分钟"
          },
          {
            "name": "QUEUEING_SERVICE_030MIN",
            "parent_type": "When you need the driver to queue for picking up order",
            "parent_enName": "When you need the driver to queue for picking up order",
            "parent_zhName": "司机等候时长",
            "enName": "An additional 30 minutes",
            "zhName": "额外30分钟"
          },
          {
            "name": "QUEUEING_SERVICE_045MIN",
            "parent_type": "When you need the driver to queue for picking up order",
            "parent_enName": "When you need the driver to queue for picking up order",
            "parent_zhName": "司机等候时长",
            "enName": "An additional 45 minutes",
            "zhName": "额外45分钟"
          },
          {
            "name": "EXTRA_CAPACITY_W_EQUIPMENT",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Extra weight with baga, 60x50x60cm (up to 50 kg)",
            "zhName": "超重（含货架，60x50x60cm，最重50公斤）"
          },
          {
            "name": "EXTRA_CAPACITY_W",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Extra weight without baga, 55x45x55cm (up to 40 kg)",
            "zhName": "超重（无货架，55x45x55cm，最重40公斤）"
          }
        ]
      },
      {
        "key": "PICK_UP_TRUCK",
        "enName": "Pickup Truck",
        "zhName": "皮卡",
        "enDesc": "Van&Truck 500kg can take this order | Cargo max 500kg",
        "zhDesc": "厢式货车及500公斤货车可接单 | 最大载货500公斤",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/16d4ffc1-438d-6827-3497-d5a6d2a78dad.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Within Da Nang)",
            "zhName": "岘港市内过路费"
          },
          {
            "name": "TOLL_FEE_01",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "To Central region",
            "zhName": "前往中部地区"
          },
          {
            "name": "TOLL_FEE_06",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "To North Region",
            "zhName": "前往北部地区"
          },
          {
            "name": "TOLL_FEE_07",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "To Southern region",
            "zhName": "前往南部地区"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          }
        ]
      },
      {
        "key": "TRUCK175",
        "enName": "Truck 500 kg",
        "zhName": "500公斤货车",
        "enDesc": "Innercity Truck Ban hours 6H-9H & 16H-20H | Van 1000kg Can Take Order",
        "zhDesc": "市区货车禁行时段 6-9时 & 16-20时 | 1000公斤厢式货车可接单",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          },
          {
            "name": "LOADING_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Loading and unloading by extra helper",
            "zhName": "额外助手负责装卸"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER1HELPER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by extra helper",
            "zhName": "额外助手上门配送"
          },
          {
            "name": "TARPAULIN",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Tarpaulin",
            "zhName": "篷布车"
          },
          {
            "name": "DROPSIDE",
            "parent_type": "Please select the Vehicle Specifications",
            "parent_enName": "Please select the Vehicle Specifications",
            "parent_zhName": "车辆规格",
            "enName": "Dropside",
            "zhName": "平板栏板"
          }
        ]
      },
      {
        "key": "TRUCK330",
        "enName": "Truck 1000 kg",
        "zhName": "1000公斤货车",
        "enDesc": "Cargo max 1000kg & 5CBM",
        "zhDesc": "最大载货1000公斤 & 5立方米",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1adefe3c-d7ef-3362-4d86-2fd8dbb23868.png",
        "specialRequests": [
          {
            "name": "TOLL_FEE",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "Toll Fee (Within Da Nang)",
            "zhName": "岘港市内过路费"
          },
          {
            "name": "TOLL_FEE_01",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "To Central region",
            "zhName": "前往中部地区"
          },
          {
            "name": "TOLL_FEE_06",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "To North Region",
            "zhName": "前往北部地区"
          },
          {
            "name": "TOLL_FEE_07",
            "parent_type": "Please select the toll fee",
            "parent_enName": "Please select the toll fee",
            "parent_zhName": "过路费",
            "enName": "To Southern region",
            "zhName": "前往南部地区"
          },
          {
            "name": "DOOR_TO_DOOR_1DRIVER",
            "parent_type": "Please select the service you need help with",
            "parent_enName": "Please select the service you need help with",
            "parent_zhName": "所需协助",
            "enName": "Door to door by driver",
            "zhName": "司机上门配送"
          }
        ]
      }
    ]
  }
};

// ─── Sandbox Vehicle Data (smaller subset for demo) ────────────────────────────

export const INITIAL_VEHICLE_DATA_SANDBOX: VehicleData = {
  "Indonesia": {
    "Jakarta": [
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Express delivery for small goods",
        "zhDesc": "小件货物快速配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          { "name": "THERMAL_BAG_1", "parent_type": "", "parent_enName": "", "parent_zhName": "", "enName": "LALABAG", "zhName": "Lalabag保温袋" },
          { "name": "ROUND_TRIP", "parent_type": "", "parent_enName": "", "parent_zhName": "", "enName": "Round Trip", "zhName": "往返" }
        ]
      },
      {
        "key": "MPV",
        "enName": "MPV",
        "zhName": "MPV",
        "enDesc": "Ideal for delicate goods including electronics",
        "zhDesc": "适合精密货物配送，包括电子产品",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/162abd3e-8e8b-a94c-9f41-e76e845fa55d.png",
        "specialRequests": [
          { "name": "TOLL_FEE_1", "parent_type": "Toll fee", "parent_enName": "Toll fee", "parent_zhName": "过路费", "enName": "Toll Fee (Intra City)", "zhName": "城内过路费" }
        ]
      }
    ],
    "Bandung": [
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Express delivery for small goods",
        "zhDesc": "小件货物快速配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          { "name": "ROUND_TRIP", "parent_type": "", "parent_enName": "", "parent_zhName": "", "enName": "Round Trip", "zhName": "往返" }
        ]
      }
    ]
  },
  "Malaysia": {
    "Kuala Lumpur": [
      {
        "key": "MOTORCYCLE",
        "enName": "Motorcycle",
        "zhName": "摩托车",
        "enDesc": "Express delivery for small parcels",
        "zhDesc": "小件货物快速配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/1089095e-75a7-93fe-3f4a-17c3e3eb1ff0.png",
        "specialRequests": [
          { "name": "LALABAG_1", "parent_type": "", "parent_enName": "", "parent_zhName": "", "enName": "LalaBag (Thermal Bag)", "zhName": "Lalabag保温袋" }
        ]
      },
      {
        "key": "4X4",
        "enName": "Pickup (4x4)",
        "zhName": "四驱皮卡",
        "enDesc": "Open cargo area for large bulky goods",
        "zhDesc": "适合大件货物配送",
        "imageUrl": "https://sg-oimg.lalamove.com/ops/prd/2026-04-16/164e1e52-1911-6019-6898-d12b373890c6.png",
        "specialRequests": []
      }
    ]
  }
};
