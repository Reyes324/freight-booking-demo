'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Input, Button, Card, Modal, message, Switch } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterprises as initialEnterprises, type Enterprise } from '@/data/adminMockData';

export default function EnterprisesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [enterpriseList, setEnterpriseList] = useState<Enterprise[]>(initialEnterprises);

  const filtered = useMemo(() => {
    if (!search.trim()) return enterpriseList;
    const q = search.toLowerCase();
    return enterpriseList.filter(
      (e) => e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
    );
  }, [search, enterpriseList]);

  const handleDisable = (id: string, name: string) => {
    Modal.confirm({
      title: '确认停用企业账号？',
      icon: <ExclamationCircleOutlined />,
      content: `确定要停用企业 "${name}" 吗？停用后该企业将无法登录系统。`,
      okText: '确认停用',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setEnterpriseList((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: 'disabled' } : e))
        );
        message.success(`已停用企业账号 "${name}"`);
      },
    });
  };

  const handleEnable = (id: string, name: string) => {
    setEnterpriseList((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'active' } : e))
    );
    message.success(`已启用企业账号 "${name}"`);
  };

  const columns: ColumnsType<Enterprise> = [
    {
      title: '企业ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id: string) => <span className="font-mono text-xs whitespace-nowrap">{id}</span>,
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      render: (name: string) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: '登录手机号',
      key: 'phone',
      width: 160,
      render: (_, r) => <span className="whitespace-nowrap">{r.countryCode} {r.phone}</span>,
    },
    {
      title: '登录密码',
      key: 'password',
      width: 100,
      render: () => (
        <span className="font-mono text-sm text-gray-400 whitespace-nowrap">
          ••••••••
        </span>
      ),
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      width: 100,
      render: (country: string) => <span className="whitespace-nowrap">{country}</span>,
    },
    {
      title: '溢价系数',
      dataIndex: 'premiumRate',
      key: 'premiumRate',
      width: 90,
      render: (v: number) => <span className="whitespace-nowrap">{v.toFixed(2)}</span>,
    },
    {
      title: '月账期额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 130,
      render: (v: number) => (
        <span className="whitespace-nowrap">CNY {v.toLocaleString()}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 110,
      render: (date: string) => <span className="whitespace-nowrap">{date}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string, record: Enterprise) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => {
            if (checked) {
              handleEnable(record.id, record.name);
            } else {
              handleDisable(record.id, record.name);
            }
          }}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 170,
      fixed: 'right',
      render: (_, r) => (
        <div className="flex gap-3 whitespace-nowrap">
          <a
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}/edit`)}
          >
            更改资料
          </a>
          <a
            className="text-blue-600 hover:text-blue-800 cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}`)}
          >
            订单交易
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
          placeholder="搜索企业ID或名称"
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
          scroll={{ x: 1600 }}
        />
      </Card>
    </div>
  );
}
