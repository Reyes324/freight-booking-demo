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

  const tableData = useMemo<Enterprise[]>(() => {
    const q = search.trim().toLowerCase();
    return enterpriseList.filter(
      (e) => !q || e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
    );
  }, [search, enterpriseList]);

  // ── 母账号启停 ──
  // 同步写回模块级 enterprises 数组（而非只更新本页 state），这样从列表页停用/启用后，
  // 再进入该企业详情页的「子账号管理」Tab 才能看到一致的启停状态（详情页会重新从
  // enterprises 数组读取）。这是仅在当前浏览会话内有效的 demo 级同步，刷新页面仍会重置。
  const syncSharedStatus = (id: string, status: Enterprise['status']) => {
    const target = initialEnterprises.find((e) => e.id === id);
    if (target) target.status = status;
  };

  const handleDisable = (id: string, name: string) => {
    Modal.confirm({
      title: '确认停用企业账号？',
      icon: <ExclamationCircleOutlined />,
      content: `确定要停用企业 "${name}" 吗？停用后该企业将无法登录系统。`,
      okText: '确认停用',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        syncSharedStatus(id, 'disabled');
        setEnterpriseList((prev) => prev.map((e) => e.id === id ? { ...e, status: 'disabled' } : e));
        message.success(`已停用企业账号 "${name}"`);
      },
    });
  };

  const handleEnable = (id: string, name: string) => {
    syncSharedStatus(id, 'active');
    setEnterpriseList((prev) => prev.map((e) => e.id === id ? { ...e, status: 'active' } : e));
    message.success(`已启用企业账号 "${name}"`);
  };

  // ── 列定义 ──
  const columns: ColumnsType<Enterprise> = [
    {
      title: '企业ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: string) => (
        <span className="font-mono text-xs whitespace-nowrap">{id}</span>
      ),
    },
    {
      title: '企业名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string) => <span className="whitespace-nowrap">{name}</span>,
    },
    {
      title: '登录手机号',
      key: 'phone',
      width: 160,
      render: (_, r) => (
        <span className="whitespace-nowrap">{r.countryCode} {r.phone}</span>
      ),
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      width: 100,
    },
    {
      title: '溢价系数',
      dataIndex: 'premiumRate',
      key: 'premiumRate',
      width: 90,
      render: (v: number) => v?.toFixed(2),
    },
    {
      title: '月账期额度',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 150,
      render: (v: number) => (
        <span className="font-mono whitespace-nowrap">CNY {v?.toLocaleString()}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string, r) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => {
            if (checked) handleEnable(r.id, r.name);
            else handleDisable(r.id, r.name);
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
            className="text-[#2257D4] hover:text-[#1C47AC] cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}/edit`)}
          >
            更改资料
          </a>
          <a
            className="text-[#2257D4] hover:text-[#1C47AC] cursor-pointer"
            onClick={() => router.push(`/admin/enterprises/${r.id}`)}
          >
            详情
          </a>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">企业账户管理</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push('/admin/enterprises/create')}
        >
          创建企业账号
        </Button>
      </div>

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

      <Card>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 家企业`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
