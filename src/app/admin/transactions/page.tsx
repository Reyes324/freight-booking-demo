'use client';

import { useState, useMemo } from 'react';
import { Table, Input, Button, Card, Select, DatePicker, Tooltip, Alert } from 'antd';
import { SearchOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
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
    () => filtered.filter((t) => t.cnyAmount > 0).reduce((sum, t) => sum + t.cnyAmount, 0),
    [filtered]
  );
  const totalExpense = useMemo(
    () => filtered.filter((t) => t.cnyAmount < 0).reduce((sum, t) => sum + t.cnyAmount, 0),
    [filtered]
  );

  const transactionTypes = ['订单支付', '订单退款'];

  const columns: ColumnsType<CreditTransaction & { enterpriseName: string }> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 160,
    },
    {
      title: '企业',
      dataIndex: 'enterpriseName',
      key: 'enterpriseName',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'description',
      key: 'description',
      width: 120,
    },
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">交易明细</h1>
        <Button icon={<DownloadOutlined />}>导出 Excel</Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <Input
          size="large"
          placeholder="搜索企业、订单号"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 280 }}
        />
        <Select
          size="large"
          placeholder="筛选企业"
          allowClear
          value={enterpriseFilter}
          onChange={setEnterpriseFilter}
          style={{ width: 160 }}
          options={enterprises.map((e) => ({ value: e.id, label: e.name }))}
        />
        <Select
          size="large"
          placeholder="筛选类型"
          allowClear
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 140 }}
          options={transactionTypes.map((t) => ({ value: t, label: t }))}
        />
        <RangePicker size="large" />
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
