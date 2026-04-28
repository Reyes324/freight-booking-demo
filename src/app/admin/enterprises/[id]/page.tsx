'use client';

import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Tabs, Table, Input, Card, DatePicker, Tag, Tooltip, Alert, Select } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  enterprises,
  creditTransactions,
  adminOrders,
  type CreditTransaction,
  type AdminOrder,
  type FeeBreakdown,
} from '@/data/adminMockData';

// 参考汇率（日常运营使用，月末按官方挂牌汇率结算）
const REFERENCE_RATES: Record<string, number> = {
  'THB': 5.00,
  'HKD': 1.10,
  'MYR': 0.65,
  'SGD': 0.19,
};

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
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const transactions = useMemo(
    () => creditTransactions.filter((t) => t.enterpriseId === enterpriseId && t.orderId !== null),
    [enterpriseId]
  );

  const filtered = useMemo(() => {
    let result = transactions;
    if (typeFilter) {
      result = result.filter((t) => t.description === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.orderId && t.orderId.toLowerCase().includes(q));
    }
    return result;
  }, [transactions, typeFilter, search]);

  const remaining = (enterprise?.creditLimit ?? 0) - (enterprise?.usedCredit ?? 0);


  const transactionTypes = ['订单支付', '订单退款'];

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

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-gray-900">
            CNY {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">
            CNY {enterprise?.creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

<div className="pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">人民币金额按订单发生当日参考汇率估算，仅用于额度控制。实际结算以每月月末汇率为准。</div>
        </div>
      </div>

      <h3 className="text-base font-medium text-gray-900 mb-4">交易明细</h3>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Input
          placeholder="搜索订单号"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="筛选类型"
          allowClear
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 140 }}
          options={transactionTypes.map((t) => ({ value: t, label: t }))}
        />
        <RangePicker />
      </div>

      <Alert
        title="人民币换算金额仅供参考，实际账期结算以每月末挂牌汇率为准"
        type="info"
        showIcon
        className="mb-4"
      />

      <Card>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            pageSize: 15,
            showTotal: (total) => `共 ${total} 条流水`,
          }}
        />
      </Card>
    </div>
  );
}

function OrdersTab({ enterpriseId }: { enterpriseId: string }) {
  const [orderNoSearch, setOrderNoSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

  const orders = useMemo(
    () => adminOrders.filter((o) => o.enterpriseId === enterpriseId),
    [enterpriseId]
  );

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter) result = result.filter((o) => o.status === statusFilter);
    if (countryFilter) result = result.filter((o) => o.country === countryFilter);
    if (supplierFilter) result = result.filter((o) => o.supplierCode === supplierFilter);
    if (orderNoSearch.trim()) {
      const q = orderNoSearch.toLowerCase();
      result = result.filter(
        (o) => o.orderId.toLowerCase().includes(q) || o.supplierOrderId.toLowerCase().includes(q)
      );
    }
    if (addressSearch.trim()) {
      const q = addressSearch.toLowerCase();
      result = result.filter(
        (o) => o.pickupAddress.toLowerCase().includes(q) || o.dropoffAddress.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, statusFilter, countryFilter, supplierFilter, orderNoSearch, addressSearch]);

  const countries = [...new Set(orders.map((o) => o.country))];
  const statuses = [...new Set(orders.map((o) => o.status))];
  const suppliers = [...new Set(orders.map((o) => o.supplierCode))];

  const statusConfig: Record<string, { color: string }> = {
    '正在呼叫司机': { color: '#2257D4' },
    '前往装货地': { color: '#2257D4' },
    '配送中': { color: '#2257D4' },
    '已完成': { color: 'default' },
    '已取消': { color: '#F23041' },
  };

  const columns: ColumnsType<AdminOrder> = [
    {
      title: '下单时间',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: 110,
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
      render: (v: string) => v.slice(5, 16),
    },
    {
      title: '供应商',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 140,
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
      title: '装货时间',
      dataIndex: 'pickupTime',
      key: 'pickupTime',
      width: 110,
      render: (v: string) => v.slice(5, 16),
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
      title: '司机车牌号',
      key: 'driverPlate',
      width: 130,
      render: (_, r) => {
        const plate = r.driverInfo?.split(' / ')[0] || '-';
        return plate === '-' ? <span className="text-gray-400">-</span> : <span className="font-mono text-xs">{plate}</span>;
      },
    },
    {
      title: '司机手机号',
      key: 'driverPhone',
      width: 140,
      render: (_, r) => {
        const phone = r.driverInfo?.split(' / ')[1] || '-';
        return phone ? <span className="text-xs">{phone}</span> : <span className="text-gray-400">-</span>;
      },
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
      sorter: (a, b) => a.lliAmount - b.lliAmount,
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
      sorter: (a, b) => a.llmAmount - b.llmAmount,
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
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Input
          placeholder="搜索单号"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={orderNoSearch}
          onChange={(e) => setOrderNoSearch(e.target.value)}
          allowClear
          style={{ width: 200 }}
        />
        <Input
          placeholder="搜索地址"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={addressSearch}
          onChange={(e) => setAddressSearch(e.target.value)}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="供应商"
          allowClear
          value={supplierFilter}
          onChange={setSupplierFilter}
          style={{ width: 160 }}
          options={suppliers.map((s) => ({ value: s, label: s }))}
        />
        <Select
          placeholder="国家"
          allowClear
          value={countryFilter}
          onChange={setCountryFilter}
          style={{ width: 120 }}
          options={countries.map((c) => ({ value: c, label: c }))}
        />
        <Select
          placeholder="状态"
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 130 }}
          options={statuses.map((s) => ({ value: s, label: s }))}
        />
      </div>

      <Alert
        title="人民币换算金额仅供参考，实际账期结算以每月末挂牌汇率为准"
        type="info"
        showIcon
        className="mb-4"
      />

      <Card>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="orderId"
          pagination={{
            pageSize: 15,
            showTotal: (total) => `共 ${total} 条订单`,
          }}
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
      <Link
        href="/admin/enterprises"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6"
      >
        <ArrowLeftOutlined />
        返回企业列表
      </Link>

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
            children: <OrdersTab enterpriseId={id} />,
          },
        ]}
      />
    </div>
  );
}
