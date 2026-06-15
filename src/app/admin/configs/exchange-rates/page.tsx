'use client';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface RateRow {
  key: string;
  flag: string;
  market: string;
  currency: string;
  rate: string;
}

const RATES: RateRow[] = [
  { key: 'VN', flag: '🇻🇳', market: '越南',      currency: 'VND', rate: '3,861' },
  { key: 'TH', flag: '🇹🇭', market: '泰国',      currency: 'THB', rate: '4.77'  },
  { key: 'MY', flag: '🇲🇾', market: '马来西亚',   currency: 'MYR', rate: '0.58'  },
  { key: 'ID', flag: '🇮🇩', market: '印度尼西亚', currency: 'IDR', rate: '2,564' },
  { key: 'SG', flag: '🇸🇬', market: '新加坡',    currency: 'SGD', rate: '0.19'  },
  { key: 'PH', flag: '🇵🇭', market: '菲律宾',    currency: 'PHP', rate: '8.10'  },
  { key: 'HK', flag: '🇭🇰', market: '香港',      currency: 'HKD', rate: '1.12'  },
];

const EFFECTIVE_DATE = '2026-04-30';

const columns: ColumnsType<RateRow> = [
  {
    title: '市场',
    dataIndex: 'market',
    width: 180,
    render: (v, row) => (
      <span className="flex items-center gap-2">
        <span className="text-lg">{row.flag}</span>
        <span className="font-medium text-gray-900">{v}</span>
      </span>
    ),
  },
  {
    title: '货币',
    dataIndex: 'currency',
    width: 120,
    render: (v) => <span className="text-gray-600">{v}</span>,
  },
  {
    title: '1 CNY 折合当地货币',
    dataIndex: 'rate',
    render: (v, row) => (
      <span className="font-mono font-medium text-gray-900">
        {v} {row.currency}
      </span>
    ),
  },
];

export default function ExchangeRatesPage() {
  return (
    <div>
      <div className="mb-5">
        <div className="text-base font-medium text-gray-900 mb-1">5月系统估算汇率</div>
        <div className="text-sm text-gray-400">
          汇率来源：中银挂牌（现汇卖出价）· 汇率参考时间：{EFFECTIVE_DATE}
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={RATES}
        rowKey="key"
        pagination={false}
        size="middle"
      />

      <div className="mt-3 text-xs text-gray-400">
        汇率仅供参考，实际结算以合同约定为准
      </div>
    </div>
  );
}
