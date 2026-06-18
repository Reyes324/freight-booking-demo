'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Input, Button, Card, Modal, message, Switch } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterprises as initialEnterprises, type Enterprise, type AdminSubAccount } from '@/data/adminMockData';

// 统一行类型：母账号 or 子账号
type RowData = {
  _key: string;
  _type: 'enterprise' | 'sub';
  _enterpriseId?: string;
  _enterpriseName?: string; // 子账号所属母账号名称
  // 共用字段
  id: string;
  name: string;
  phone: string;
  country: string;
  status: 'active' | 'disabled';
  createdAt: string;
  // 母账号独有
  countryCode?: string;
  premiumRate?: number;
  creditLimit?: number;
  isParent?: boolean;
  // 子账号独有（额度/余额）
  quota?: number;
  balance?: number;
};

export default function EnterprisesPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [enterpriseList, setEnterpriseList] = useState<Enterprise[]>(initialEnterprises);


  // ── 构建树形数据 ──
  const tableData = useMemo<RowData[]>(() => {
    const q = search.trim().toLowerCase();
    return enterpriseList
      .filter((e) => !q || e.id.toLowerCase().includes(q) || e.name.toLowerCase().includes(q))
      .map((e) => {
        const row: RowData = {
          _key: e.id,
          _type: 'enterprise',
          id: e.id,
          name: e.name,
          phone: `${e.countryCode} ${e.phone}`,
          country: e.country,
          status: e.status,
          createdAt: e.createdAt,
          countryCode: e.countryCode,
          premiumRate: e.premiumRate,
          creditLimit: e.creditLimit,
          isParent: e.isParent,
        };
        const rows: RowData[] = [row];
        if (e.isParent && e.subAccounts?.length) {
          e.subAccounts.forEach((s) => {
            rows.push({
              _key: s.id,
              _type: 'sub',
              _enterpriseId: e.id,
              _enterpriseName: e.name,
              id: s.id,
              name: s.name,
              phone: s.phone,
              country: e.country,
              status: s.status,
              createdAt: s.createdAt,
              quota: s.quota,
              balance: s.balance,
            });
          });
        }
        return rows;
      })
      .flat();
  }, [search, enterpriseList]);

  // ── 母账号启停 ──
  const handleDisable = (id: string, name: string) => {
    Modal.confirm({
      title: '确认停用企业账号？',
      icon: <ExclamationCircleOutlined />,
      content: `确定要停用企业 "${name}" 吗？停用后该企业将无法登录系统。`,
      okText: '确认停用',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        setEnterpriseList((prev) => prev.map((e) => e.id === id ? { ...e, status: 'disabled' } : e));
        message.success(`已停用企业账号 "${name}"`);
      },
    });
  };

  const handleEnable = (id: string, name: string) => {
    setEnterpriseList((prev) => prev.map((e) => e.id === id ? { ...e, status: 'active' } : e));
    message.success(`已启用企业账号 "${name}"`);
  };

  // ── 子账号启停 ──
  const handleSubToggle = (enterpriseId: string, subId: string, subName: string, enable: boolean) => {
    const doToggle = () => {
      setEnterpriseList((prev) =>
        prev.map((e) => {
          if (e.id !== enterpriseId || !e.subAccounts) return e;
          return {
            ...e,
            subAccounts: e.subAccounts.map((s) =>
              s.id === subId ? { ...s, status: enable ? 'active' : 'disabled' } : s
            ),
          };
        })
      );
      message.success(`已${enable ? '启用' : '停用'}子账号 "${subName}"`);
    };
    if (!enable) {
      Modal.confirm({
        title: '确认停用子账号？',
        icon: <ExclamationCircleOutlined />,
        content: `确定停用子账号 "${subName}" 吗？`,
        okText: '确认停用',
        okType: 'danger',
        cancelText: '取消',
        onOk: doToggle,
      });
    } else {
      doToggle();
    }
  };

  // ── 列定义 ──
  const columns: ColumnsType<RowData> = [
    {
      title: '企业ID',
      key: 'enterpriseId',
      width: 90,
      render: (_, r) => (
        <span className="font-mono text-xs whitespace-nowrap">
          {r._type === 'sub' ? r._enterpriseId : r.id}
        </span>
      ),
    },
    {
      title: '账号ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (id: string) => (
        <span className="font-mono text-xs whitespace-nowrap">{id}</span>
      ),
    },
    {
      title: '企业名称',
      key: 'enterpriseName',
      width: 160,
      render: (_, r) => (
        <span className="whitespace-nowrap">
          {r._type === 'sub' ? r._enterpriseName : r.name}
        </span>
      ),
    },
    {
      title: '账号名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (name: string, r) => (
        r._type === 'sub' ? (
          <div className="flex items-center gap-1 pl-2">
            <span className="text-gray-300 text-sm select-none">└</span>
            <span className="whitespace-nowrap">{name}</span>
          </div>
        ) : (
          <span className="whitespace-nowrap">{name}</span>
        )
      ),
    },
    {
      title: '账号类型',
      key: 'accountType',
      width: 100,
      render: (_, r) => (
        <span className="text-sm">{r._type === 'sub' ? '子账号' : '企业账号'}</span>
      ),
    },
    {
      title: '登录手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 160,
      render: (v: string) => <span className="whitespace-nowrap">{v}</span>,
    },
    {
      title: '国家',
      dataIndex: 'country',
      key: 'country',
      width: 100,
    },
    {
      title: '溢价系数',
      key: 'premiumRate',
      width: 90,
      render: (_, r) =>
        r._type === 'sub' ? <span className="text-gray-400">—</span> : r.premiumRate?.toFixed(2),
    },
    {
      title: '月账期额度',
      key: 'creditLimit',
      width: 150,
      render: (_, r) => (
        <span className="font-mono whitespace-nowrap">
          CNY {(r._type === 'sub' ? r.quota : r.creditLimit)?.toLocaleString()}
        </span>
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
            if (r._type === 'sub') {
              handleSubToggle(r._enterpriseId!, r.id, r.name, checked);
            } else {
              if (checked) handleEnable(r.id, r.name);
              else handleDisable(r.id, r.name);
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
      render: (_, r) => {
        if (r._type === 'sub') {
          return (
            <div className="flex gap-3 whitespace-nowrap">
              <a
                className="text-[#2257D4] hover:text-[#1C47AC] cursor-pointer"
                onClick={() => router.push(`/admin/enterprises/${r.id}/edit`)}
              >
                更改资料
              </a>
              <a
                className="text-[#2257D4] hover:text-[#1C47AC] cursor-pointer"
                onClick={() => router.push(`/admin/enterprises/${r._enterpriseId}?tab=sub-accounts`)}
              >
                详情
              </a>
            </div>
          );
        }
        return (
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
        );
      },
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
          rowKey="_key"
          onRow={(r) => r._type === 'sub' ? { style: { background: '#F9FAFB' } } : {}}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 家企业`,
          }}
          scroll={{ x: 1500 }}
        />
      </Card>


    </div>
  );
}
