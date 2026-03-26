'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Input, Button, Card } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterprises, type Enterprise } from '@/data/adminMockData';

export default function EnterprisesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return enterprises;
    const q = search.toLowerCase();
    return enterprises.filter(
      (e) => e.name.toLowerCase().includes(q) || e.phone.includes(q)
    );
  }, [search]);

  const columns: ColumnsType<Enterprise> = [
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      width: 160,
    },
    {
      title: '登录手机号',
      key: 'phone',
      width: 160,
      render: (_, r) => `${r.countryCode} ${r.phone}`,
    },
    {
      title: '登录密码',
      key: 'password',
      width: 120,
      render: (_, r) => r.password,
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      width: 80,
    },
    {
      title: '溢价系数',
      dataIndex: 'premiumRate',
      key: 'premiumRate',
      width: 100,
      render: (v: number) => v.toFixed(2),
    },
    {
      title: '月账期额度',
      key: 'creditLimit',
      width: 160,
      render: (_, r) => `${r.currency} ${r.creditLimit.toLocaleString()}`,
    },
    {
      title: '已用额度',
      key: 'usedCredit',
      width: 160,
      render: (_, r) => `${r.currency} ${r.usedCredit.toLocaleString()}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_, r) => (
        <div className="flex gap-3">
          <a
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}/edit`)}
          >
            更改信息
          </a>
          <a
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}?tab=credit`)}
          >
            交易明细
          </a>
          <a
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}?tab=orders`)}
          >
            订单记录
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">企业用户管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/admin/enterprises/create')}
        >
          创建企业账号
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="搜索企业名称或手机号"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="max-w-[400px]"
        />
      </div>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 家企业`,
          }}
          scroll={{ x: 1300 }}
        />
      </Card>
    </div>
  );
}
