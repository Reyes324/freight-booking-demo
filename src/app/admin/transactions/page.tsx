'use client';

import { useState, useMemo } from 'react';
import { Table, Input, Button, Card, Select, DatePicker } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterprises, creditTransactions, type CreditTransaction } from '@/data/adminMockData';

const { RangePicker } = DatePicker;

export default function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [enterpriseFilter, setEnterpriseFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const enterpriseMap = useMemo(() => {
    const map: Record<string, { name: string; currency: string }> = {};
    enterprises.forEach((e) => { map[e.id] = { name: e.name, currency: e.currency }; });
    return map;
  }, []);

  const allTransactions = useMemo(() => {
    return creditTransactions
      .map((t) => ({
        ...t,
        enterpriseName: enterpriseMap[t.enterpriseId]?.name || '-',
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [enterpriseMap]);

  const filtered = useMemo(() => {
    let result = allTransactions;

    if (enterpriseFilter) {
      result = result.filter((t) => t.enterpriseId === enterpriseFilter);
    }
    if (typeFilter) {
      result = result.filter((t) => t.description === typeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.enterpriseName.toLowerCase().includes(q) ||
          (t.orderId && t.orderId.toLowerCase().includes(q)) ||
          t.description.includes(q)
      );
    }

    return result;
  }, [search, enterpriseFilter, typeFilter, allTransactions]);

  const totalIncome = useMemo(
    () => filtered.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    [filtered]
  );
  const totalExpense = useMemo(
    () => filtered.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    [filtered]
  );

  const transactionTypes = [...new Set(creditTransactions.map((t) => t.description))];

  const columns: ColumnsType<CreditTransaction & { enterpriseName: string }> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 180,
    },
    {
      title: '企业',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: 130,
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 200,
      render: (v: string | null) => v || '-',
    },
    {
      title: '类型',
      dataIndex: 'description',
      key: 'description',
      width: 120,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render: (v: number, r) => {
        const prefix = v > 0 ? '+' : '';
        const color = v > 0 ? 'text-green-600' : 'text-gray-900';
        return (
          <span className={color}>
            {prefix}{r.currency} {Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      title: '币种',
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">交易明细</h1>
        <Button icon={<DownloadOutlined />}>导出 Excel</Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 mb-6 max-w-lg">
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="text-sm text-gray-500">总笔数</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{filtered.length}</div>
        </div>
        <div className="border border-gray-200 rounded-xl p-4 bg-white">
          <div className="text-sm text-gray-500">总支出</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <Input
          placeholder="搜索企业、订单号"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="max-w-[280px]"
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
          placeholder="筛选类型"
          allowClear
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 140 }}
          options={transactionTypes.map((t) => ({ value: t, label: t }))}
        />
        <RangePicker />
      </div>

      {/* Table */}
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
