'use client';

import { useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Card, Tag, Select, Tooltip, Alert } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterprises, adminOrders, type AdminOrder, type FeeBreakdown } from '@/data/adminMockData';
import * as XLSX from 'xlsx';

// 参考汇率（日常运营使用，月末按官方挂牌汇率结算）
const REFERENCE_RATES: Record<string, number> = {
  'THB': 4.85,    // 1 CNY = 4.85 THB
  'VND': 3450.00, // 1 CNY = 3450 VND
  'MYR': 0.62,    // 1 CNY = 0.62 MYR
  'IDR': 2150.00, // 1 CNY = 2150 IDR
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

export default function AdminOrdersPage() {
  // 捕获模式：用于 Figma Code to Canvas
  // 访问 ?cap 可强制显示所有 Tooltip，方便捕获交互状态
  const [captureMode, setCaptureMode] = useState(false);

  // 客户端检测 URL 参数
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCaptureMode(params.has('cap'));
    }
  }, []);

  const [orderNoSearch, setOrderNoSearch] = useState('');
  const [addressSearch, setAddressSearch] = useState('');
  const [enterpriseFilter, setEnterpriseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [supplierFilter, setSupplierFilter] = useState<string | null>(null);

  const enterpriseMap = useMemo(() => {
    const map: Record<string, string> = {};
    enterprises.forEach((e) => { map[e.id] = e.name; });
    return map;
  }, []);

  const filtered = useMemo(() => {
    let result = adminOrders;

    if (enterpriseFilter) {
      result = result.filter((o) => o.enterpriseId === enterpriseFilter);
    }
    if (statusFilter) {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (countryFilter) {
      result = result.filter((o) => o.country === countryFilter);
    }
    if (supplierFilter) {
      result = result.filter((o) => o.supplierCode === supplierFilter);
    }
    if (orderNoSearch.trim()) {
      const q = orderNoSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.supplierOrderId.toLowerCase().includes(q)
      );
    }
    if (addressSearch.trim()) {
      const q = addressSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.pickupAddress.toLowerCase().includes(q) ||
          o.dropoffAddress.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orderNoSearch, addressSearch, enterpriseFilter, statusFilter, countryFilter, supplierFilter, enterpriseMap]);

  const handleExport = () => {
    const data = filtered.map((o) => ({
      '下单日期': o.orderDate,
      '企业客户': enterpriseMap[o.enterpriseId] || '',
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
      'LLI-基础运费': o.lliFeeBreakdown.baseFare,
      'LLI-里程费': o.lliFeeBreakdown.distanceFee,
      'LLI-服务费': o.lliFeeBreakdown.serviceFee,
      'LLI-附加费': o.lliFeeBreakdown.surcharge,
      'LLI-税费': o.lliFeeBreakdown.tax,
      'LLI-优惠减免': o.lliFeeBreakdown.discount,
      'LLM账单金额': o.llmAmount,
      'LLM账单-CNY换算': toCNY(o.llmAmount, o.currency).toFixed(2),
      'LLM-基础运费': o.llmFeeBreakdown.baseFare,
      'LLM-里程费': o.llmFeeBreakdown.distanceFee,
      'LLM-服务费': o.llmFeeBreakdown.serviceFee,
      'LLM-附加费': o.llmFeeBreakdown.surcharge,
      'LLM-税费': o.llmFeeBreakdown.tax,
      'LLM-优惠减免': o.llmFeeBreakdown.discount,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '全部订单');
    XLSX.writeFile(wb, `全部企业订单记录.xlsx`);
  };

  const statusConfig: Record<string, { color: string }> = {
    '正在呼叫司机': { color: '#2257D4' },  // Brand/Primary（橙色 #FF6600 不在规范内）
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
      title: '企业客户',
      key: 'enterprise',
      width: 110,
      render: (_, r) => enterpriseMap[r.enterpriseId] || '-',
    },
    {
      title: '供应商',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      width: 140,
      render: (v: string, r) => (
        <Tooltip
          title={r.supplierName}
          open={captureMode ? true : undefined}
        >
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
        <Tooltip
          title={`${r.pickupAddress}\n${r.pickupContact}`}
          open={captureMode ? true : undefined}
        >
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
        <Tooltip
          title={`${r.dropoffAddress}\n${r.dropoffContact}`}
          open={captureMode ? true : undefined}
        >
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
      render: (v: string) => (
        <Tag color={statusConfig[v]?.color || 'default'}>{v}</Tag>
      ),
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
          open={captureMode ? true : undefined}
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
          open={captureMode ? true : undefined}
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

  const countries = [...new Set(adminOrders.map((o) => o.country))];
  const statuses = [...new Set(adminOrders.map((o) => o.status))];
  const suppliers = [...new Set(adminOrders.map((o) => o.supplierCode))];

  return (
    <div>
      {/* 捕获模式提示 */}
      {captureMode && (
        <Alert
          message="📸 Figma 捕获模式 (URL 加了 ?cap)"
          description="所有气泡已强制显示，现在可以直接捕获到 Figma。完成后删除 ?cap 即可恢复正常。"
          type="success"
          showIcon
          closable
          className="mb-4"
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">订单记录</h1>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出 Excel
        </Button>
      </div>

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

      {/* Alert提示 */}
      <Alert
        title="人民币换算金额仅供参考，实际账期结算以每月末挂牌汇率为准"
        type="info"
        showIcon
        className="mb-4"
      />

      {/* Table */}
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
