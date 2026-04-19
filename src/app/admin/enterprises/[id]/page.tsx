'use client';

import { useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Tabs, Table, Input, Button, Card, DatePicker, Tag, Tooltip, Progress, Alert } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  enterprises,
  creditTransactions,
  adminOrders,
  getMonthlyRate,
  getCurrentMonth,
  type CreditTransaction,
  type AdminOrder,
  type FeeBreakdown,
} from '@/data/adminMockData';
import * as XLSX from 'xlsx';

// 参考汇率（日常运营使用，月末按官方挂牌汇率结算）
const REFERENCE_RATES: Record<string, number> = {
  'THB': 5.00,  // 1 CNY = 5.00 THB
  'HKD': 1.10,  // 1 CNY = 1.10 HKD
  'MYR': 0.65,  // 1 CNY = 0.65 MYR
  'SGD': 0.19,  // 1 CNY = 0.19 SGD
};

// 转换为CNY（仅供参考）
function toCNY(amount: number, currency: string): number {
  const rate = REFERENCE_RATES[currency] || 1;
  return amount / rate;
}

function FeeTooltip({ breakdown, currency }: { breakdown: FeeBreakdown; currency: string }) {
  const items = [
    { label: '基础运费', value: breakdown.baseFare },
    { label: '里程费', value: breakdown.distanceFee },
    { label: '服务费', value: breakdown.serviceFee },
    { label: '附加费', value: breakdown.surcharge },
    { label: '税费', value: breakdown.tax },
  ];
  if (breakdown.discount > 0) {
    items.push({ label: '优惠减免', value: -breakdown.discount });
  }

  return (
    <div className="text-xs min-w-[160px]">
      {items.map((item) => (
        item.value !== 0 && (
          <div key={item.label} className="flex justify-between gap-4 py-0.5">
            <span className="text-gray-300">{item.label}</span>
            <span>{currency} {item.value.toFixed(2)}</span>
          </div>
        )
      ))}
      <div className="border-t border-gray-500 mt-1 pt-1 flex justify-between gap-4 font-medium">
        <span>合计</span>
        <span>{currency} {breakdown.total.toFixed(2)}</span>
      </div>
    </div>
  );
}

const { RangePicker } = DatePicker;

function CreditTab({ enterpriseId, currency }: { enterpriseId: string; currency: string }) {
  const enterprise = enterprises.find((e) => e.id === enterpriseId);
  const transactions = useMemo(
    () => creditTransactions.filter((t) => t.enterpriseId === enterpriseId && t.orderId !== null), // 只显示订单交易
    [enterpriseId]
  );

  const remaining = (enterprise?.creditLimit ?? 0) - (enterprise?.usedCredit ?? 0);

  // 获取当月汇率
  const currentMonth = getCurrentMonth();
  const monthlyRate = getMonthlyRate(currentMonth);
  const localCurrency = enterprise?.localCurrency || 'HKD';
  const exchangeRate = monthlyRate?.rates[`CNY/${localCurrency}` as keyof typeof monthlyRate.rates];

  const columns: ColumnsType<CreditTransaction> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 180 },
    { title: '类型', dataIndex: 'description', key: 'description', width: 120 },
    {
      title: '订单金额',
      key: 'localCurrency',
      width: 150,
      render: (_, record) => {
        if (!record.localCurrency || !record.localAmount) return '-';
        return (
          <div>
            <div className="font-medium">
              {record.localCurrency} {record.localAmount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              ≈ CNY {Math.abs(record.cnyAmount).toFixed(2)}
            </div>
          </div>
        );
      },
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 160,
      render: (v: string | null) => v || '-',
    },
  ];

  return (
    <div>
      {/* Balance card */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
        <div className="text-sm text-gray-500 mb-2">当前余额</div>

        {/* 人民币余额 */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">
            ¥ {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">
            ¥ {enterprise?.creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* 使用百分比 */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>已使用 {((enterprise?.usedCredit ?? 0) / (enterprise?.creditLimit ?? 1) * 100).toFixed(1)}%</span>
          </div>
          <Progress
            percent={((enterprise?.usedCredit ?? 0) / (enterprise?.creditLimit ?? 1) * 100)}
            showInfo={false}
            strokeColor="#2257D4"
          />
        </div>

        {/* 汇率信息 */}
        {monthlyRate && exchangeRate && (
          <div className="pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-1">参考汇率（实际结算以月末挂牌汇率为准）</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono text-gray-900">
                1 CNY = {exchangeRate} {localCurrency}
              </span>
              <Tooltip title={`${monthlyRate.rateDate} 参考汇率`}>
                <InfoCircleOutlined className="text-gray-400 cursor-help" />
              </Tooltip>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              剩余额度约 {localCurrency} {(remaining * exchangeRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}（参考）
            </div>
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-medium text-gray-900">交易明细</h3>
        <RangePicker />
      </div>

      {/* Alert提示 */}
      <Alert
        title="人民币换算金额仅供参考，实际账期结算以每月末挂牌汇率为准"
        type="info"
        showIcon
        className="mb-4"
      />

      <Card>
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

function OrdersTab({ enterpriseId, enterpriseName }: { enterpriseId: string; enterpriseName: string }) {
  const orders = useMemo(
    () => adminOrders.filter((o) => o.enterpriseId === enterpriseId),
    [enterpriseId]
  );

  const handleExport = () => {
    const data = orders.map((o) => ({
      '下单日期': o.orderDate,
      '企业客户': enterpriseName,
      '供应商': o.supplierCode,
      '国家': o.country,
      '车型': o.vehicleType,
      '起始地址': o.pickupAddress,
      '起始联系人': o.pickupContact,
      '目的地址': o.dropoffAddress,
      '目的联系人': o.dropoffContact,
      'LLI单号': o.orderId,
      '供应商单号': o.supplierOrderId,
      '司机信息': o.driverInfo,
      '订单状态': o.status,
      '币种': o.currency,
      '参考汇率': `1 CNY = ${REFERENCE_RATES[o.currency] || '-'} ${o.currency}`,
      'LLI账单金额': o.lliAmount,
      'LLI账单-CNY换算': toCNY(o.lliAmount, o.currency).toFixed(2),
      'LLM账单金额': o.llmAmount,
      'LLM账单-CNY换算': toCNY(o.llmAmount, o.currency).toFixed(2),
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '订单记录');
    XLSX.writeFile(wb, `${enterpriseName}_订单记录.xlsx`);
  };

  const statusConfig: Record<string, { color: string }> = {
    '正在呼叫司机': { color: 'orange' },
    '前往装货地': { color: 'cyan' },
    '配送中': { color: 'blue' },
    '已完成': { color: 'green' },
    '已取消': { color: 'red' },
    '已过期': { color: 'default' },
  };

  const columns: ColumnsType<AdminOrder> = [
    {
      title: '下单日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 110,
      render: (v: string) => v.slice(5, 16),
    },
    {
      title: '供应商',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 100,
      render: (v: string, r) => (
        <Tooltip title={r.supplierName}>
          <span className="cursor-default">{v}</span>
        </Tooltip>
      ),
    },
    { title: '国家', dataIndex: 'country', key: 'country', width: 80 },
    { title: '车型', dataIndex: 'vehicleType', key: 'vehicleType', width: 110 },
    {
      title: '起始地址',
      key: 'pickup',
      width: 200,
      ellipsis: true,
      render: (_, r) => (
        <Tooltip title={`${r.pickupAddress}\n${r.pickupContact}`}>
          <div>
            <div className="truncate text-sm">{r.pickupAddress}</div>
            <div className="truncate text-xs text-gray-400">{r.pickupContact}</div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '目的地址',
      key: 'dropoff',
      width: 200,
      ellipsis: true,
      render: (_, r) => (
        <Tooltip title={`${r.dropoffAddress}\n${r.dropoffContact}`}>
          <div>
            <div className="truncate text-sm">{r.dropoffAddress}</div>
            <div className="truncate text-xs text-gray-400">{r.dropoffContact}</div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'LLI单号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 160,
      render: (v: string) => <span className="text-xs font-mono">{v}</span>,
    },
    {
      title: '供应商单号',
      dataIndex: 'supplierOrderId',
      key: 'supplierOrderId',
      width: 160,
      render: (v: string) => <span className="text-xs font-mono">{v}</span>,
    },
    {
      title: '司机',
      dataIndex: 'driverInfo',
      key: 'driverInfo',
      width: 180,
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (v: string) => <Tag color={statusConfig[v]?.color || 'default'}>{v}</Tag>,
    },
    {
      title: 'LLI账单金额',
      key: 'lliAmount',
      width: 150,
      render: (_, r) => (
        <Tooltip
          title={<FeeTooltip breakdown={r.lliFeeBreakdown} currency={r.currency} />}
          placement="left"
        >
          <div className="cursor-default">
            <div className="font-medium">
              {r.currency} {r.lliAmount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              ≈ CNY {toCNY(r.lliAmount, r.currency).toFixed(2)}
            </div>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'LLM账单金额',
      key: 'llmAmount',
      width: 150,
      render: (_, r) => (
        <Tooltip
          title={<FeeTooltip breakdown={r.llmFeeBreakdown} currency={r.currency} />}
          placement="left"
        >
          <div className="cursor-default">
            <div className="font-medium">
              {r.currency} {r.llmAmount.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              ≈ CNY {toCNY(r.llmAmount, r.currency).toFixed(2)}
            </div>
          </div>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="搜索订单"
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          style={{ width: 300 }}
        />
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出 Excel
        </Button>
      </div>

      {/* Alert提示 */}
      <Alert
        title="人民币换算金额仅供参考，实际账期结算以每月末挂牌汇率为准"
        type="info"
        showIcon
        className="mb-4"
      />

      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1900 }}
          size="small"
        />
      </Card>
    </div>
  );
}

export default function EnterpriseDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const defaultTab = searchParams.get('tab') || 'credit';
  const enterprise = enterprises.find((e) => e.id === id);

  if (!enterprise) {
    return (
      <div className="text-center py-20 text-gray-500">
        企业不存在
        <br />
        <Link href="/admin/enterprises" style={{ color: '#2257D4' }}>
          返回列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/enterprises"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6"
      >
        <ArrowLeftOutlined />
        返回企业列表
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {enterprise.name}
          <span className="text-gray-400 text-lg font-normal ml-2">({enterprise.country})</span>
        </h1>
        <div className="flex gap-6 mt-2 text-sm text-gray-500">
          <span>登录手机号: {enterprise.countryCode} {enterprise.phone}</span>
          <span>溢价系数: {enterprise.premiumRate.toFixed(2)}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey={defaultTab}
        items={[
          {
            key: 'credit',
            label: '交易明细',
            children: <CreditTab enterpriseId={id} currency={enterprise.currency} />,
          },
          {
            key: 'orders',
            label: '订单记录',
            children: <OrdersTab enterpriseId={id} enterpriseName={enterprise.name} />,
          },
        ]}
      />
    </div>
  );
}
