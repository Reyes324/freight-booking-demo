'use client';

import { useState, useMemo } from 'react';
import { Table, Input, Button, Card, Tag, Select } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterprises, adminOrders, type AdminOrder } from '@/data/adminMockData';
import * as XLSX from 'xlsx';

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [enterpriseFilter, setEnterpriseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);

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
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.llmOrderId.toLowerCase().includes(q) ||
          o.pickupAddress.toLowerCase().includes(q) ||
          o.dropoffAddress.toLowerCase().includes(q) ||
          o.driverInfo.toLowerCase().includes(q) ||
          enterpriseMap[o.enterpriseId]?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [search, enterpriseFilter, statusFilter, countryFilter, enterpriseMap]);

  const handleExport = () => {
    const data = filtered.map((o) => ({
      '下单日期': o.orderDate,
      '客户': enterpriseMap[o.enterpriseId] || '',
      '国家': o.country,
      '车型': o.vehicleType,
      '起始地址': o.pickupAddress,
      '起始联系人': o.pickupContact,
      '目的地址': o.dropoffAddress,
      '目的联系人': o.dropoffContact,
      'LLM单号': o.llmOrderId,
      '司机信息': o.driverInfo,
      '订单状态': o.status,
      [`LLI账单金额(${o.currency})`]: o.lliAmount,
      [`LLM账单金额(${o.currency})`]: o.llmAmount,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '全部订单');
    XLSX.writeFile(wb, `全部企业订单记录.xlsx`);
  };

  const statusColor: Record<string, string> = {
    '已完成': 'green',
    '进行中': 'blue',
    '已取消': 'red',
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
      title: '客户',
      key: 'enterprise',
      width: 120,
      render: (_, r) => enterpriseMap[r.enterpriseId] || '-',
    },
    { title: '国家', dataIndex: 'country', key: 'country', width: 60 },
    { title: '车型', dataIndex: 'vehicleType', key: 'vehicleType', width: 110 },
    {
      title: '起始地址',
      dataIndex: 'pickupAddress',
      key: 'pickupAddress',
      width: 180,
      ellipsis: true,
    },
    {
      title: '目的地址',
      dataIndex: 'dropoffAddress',
      key: 'dropoffAddress',
      width: 180,
      ellipsis: true,
    },
    { title: 'LLM单号', dataIndex: 'llmOrderId', key: 'llmOrderId', width: 150 },
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
      width: 80,
      render: (v: string) => <Tag color={statusColor[v] || 'default'}>{v}</Tag>,
    },
    {
      title: 'LLI金额',
      dataIndex: 'lliAmount',
      key: 'lliAmount',
      width: 100,
      render: (v: number) => v.toFixed(2),
    },
    {
      title: 'LLM金额',
      dataIndex: 'llmAmount',
      key: 'llmAmount',
      width: 100,
      render: (v: number) => v.toFixed(2),
    },
  ];

  const countries = [...new Set(adminOrders.map((o) => o.country))];
  const statuses = [...new Set(adminOrders.map((o) => o.status))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">订单记录</h1>
        <Button icon={<DownloadOutlined />} onClick={handleExport}>
          导出 Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Input
          placeholder="搜索订单号、地址、司机、客户"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="max-w-[320px]"
        />
        <Select
          placeholder="筛选企业"
          allowClear
          value={enterpriseFilter}
          onChange={setEnterpriseFilter}
          style={{ width: 160 }}
          options={enterprises.map((e) => ({ value: e.id, label: e.name }))}
        />
        <Select
          placeholder="筛选国家"
          allowClear
          value={countryFilter}
          onChange={setCountryFilter}
          style={{ width: 120 }}
          options={countries.map((c) => ({ value: c, label: c }))}
        />
        <Select
          placeholder="筛选状态"
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 120 }}
          options={statuses.map((s) => ({ value: s, label: s }))}
        />
      </div>

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
          scroll={{ x: 1400 }}
        />
      </Card>
    </div>
  );
}
