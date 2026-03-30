'use client';

import { useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Tabs, Table, Input, Button, Card, DatePicker, Tag, Tooltip } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  enterprises,
  creditTransactions,
  adminOrders,
  type CreditTransaction,
  type AdminOrder,
  type FeeBreakdown,
} from '@/data/adminMockData';
import * as XLSX from 'xlsx';

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
    () => creditTransactions.filter((t) => t.enterpriseId === enterpriseId),
    [enterpriseId]
  );

  const remaining = (enterprise?.creditLimit ?? 0) - (enterprise?.usedCredit ?? 0);

  const columns: ColumnsType<CreditTransaction> = [
    { title: '日期', dataIndex: 'date', key: 'date', width: 180 },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 200,
      render: (v: string | null) => v || '-',
    },
    { title: '描述', dataIndex: 'description', key: 'description', width: 120 },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render: (v: number) => {
        const prefix = v > 0 ? '+' : '';
        return `${prefix}${currency} ${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
      },
    },
  ];

  return (
    <div>
      {/* Balance card */}
      <div className="border border-gray-200 rounded-xl p-6 bg-white mb-6">
        <div className="text-sm text-gray-500 mb-2">当前余额</div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">
            {currency} {remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-gray-400">
            {currency} {enterprise?.creditLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Transactions */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900">交易明细</h3>
        <RangePicker />
      </div>
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
      'LLI账单金额': o.lliAmount,
      'LLM账单金额': o.llmAmount,
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
      width: 130,
      render: (_, r) => (
        <Tooltip
          title={<FeeTooltip breakdown={r.lliFeeBreakdown} currency={r.currency} />}
          placement="left"
        >
          <span className="cursor-default font-medium">
            {r.currency} {r.lliAmount.toFixed(2)}
          </span>
        </Tooltip>
      ),
    },
    {
      title: 'LLM账单金额',
      key: 'llmAmount',
      width: 130,
      render: (_, r) => (
        <Tooltip
          title={<FeeTooltip breakdown={r.llmFeeBreakdown} currency={r.currency} />}
          placement="left"
        >
          <span className="cursor-default font-medium">
            {r.currency} {r.llmAmount.toFixed(2)}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="搜索订单"
          prefix={<SearchOutlined className="text-gray-400" />}
          allowClear
          className="max-w-[300px]"
        />
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出 Excel
        </Button>
      </div>

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
        <Link href="/admin/enterprises" className="text-blue-600">
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
