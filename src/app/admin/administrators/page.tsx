'use client';

import { useState, useMemo, useEffect } from 'react';
import { Table, Input, Button, Card, Tag, Space, Modal, message, Switch } from 'antd';
import { SearchOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Administrator } from '@/types/auth';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  getAllAdministrators,
  searchAdministrators,
  updateAdministratorStatus,
} from '@/utils/administratorManagement';
import CreateAdministratorModal from '@/components/Admin/CreateAdministratorModal';
import EditAdministratorModal from '@/components/Admin/EditAdministratorModal';

export default function AdministratorsPage() {
  const { admin, isLoading, isSuperAdmin } = useAdminAuth();
  const [search, setSearch] = useState('');
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Administrator | null>(null);

  // 加载管理员列表
  const loadData = () => {
    setAdministrators(getAllAdministrators());
  };

  useEffect(() => {
    loadData();
  }, []);

  // 搜索过滤
  const filtered = useMemo(() => {
    if (!search.trim()) {
      return administrators;
    }
    return searchAdministrators(search);
  }, [search, administrators]);

  // 处理禁用
  const handleDisable = (id: string, name: string) => {
    Modal.confirm({
      title: '确认禁用管理员？',
      icon: <ExclamationCircleOutlined />,
      content: `确定要禁用管理员 "${name}" 吗？禁用后该账号将无法登录。`,
      okText: '确认禁用',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const result = updateAdministratorStatus(id, 'disabled');
        if (result.success) {
          message.success('禁用成功');
          loadData();
        } else {
          message.error(result.error || '禁用失败');
        }
      },
    });
  };

  // 处理启用
  const handleEnable = (id: string, name: string) => {
    const result = updateAdministratorStatus(id, 'active');
    if (result.success) {
      message.success(`已启用管理员 "${name}"`);
      loadData();
    } else {
      message.error(result.error || '启用失败');
    }
  };

  // 处理编辑
  const handleEdit = (record: Administrator) => {
    setEditingAdmin(record);
    setEditModalVisible(true);
  };

  const columns: ColumnsType<Administrator> = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
      width: 150,
      render: (v: string) => <span className="font-mono text-sm">{v}</span>,
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 130,
      render: (role: string) =>
        role === 'super_admin' ? (
          <Tag color="blue">超级管理员</Tag>
        ) : (
          <Tag>运营人员</Tag>
        ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: Administrator) => {
        // 初始账号或非超级管理员：不可操作
        const disabled = record.cannotBeDeleted || !isSuperAdmin || (admin && admin.id === record.id);

        return (
          <Switch
            checked={status === 'active'}
            disabled={disabled}
            onChange={(checked) => {
              if (checked) {
                handleEnable(record.id, record.name);
              } else {
                handleDisable(record.id, record.name);
              }
            }}
            checkedChildren="启用"
            unCheckedChildren="禁用"
          />
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => {
        // 初始账号或非超级管理员：不显示操作
        if (record.cannotBeDeleted || !isSuperAdmin) {
          return <span className="text-gray-400">-</span>;
        }

        // 不能操作自己
        if (admin && admin.id === record.id) {
          return <span className="text-gray-400">当前账号</span>;
        }

        return (
          <Button
            type="link"
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">运营账号管理</h1>
        {isSuperAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            style={{ backgroundColor: '#1f2937', borderColor: '#1f2937' }}
          >
            创建运营账号
          </Button>
        )}
      </div>

      {/* 搜索框 */}
      <div className="mb-6">
        <Input
          size="large"
          placeholder="搜索账号或姓名"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          style={{ width: 360 }}
        />
      </div>

      {/* 提示信息 */}
      {!isSuperAdmin && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
          您当前是运营人员，仅可查看账号列表。创建、编辑、启用、禁用操作需要超级管理员权限。
        </div>
      )}

      {/* 表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showTotal: (total) => `共 ${total} 个管理员`,
          }}
          size="small"
        />
      </Card>

      {/* 创建管理员弹窗 */}
      {admin && (
        <CreateAdministratorModal
          open={createModalVisible}
          onCancel={() => setCreateModalVisible(false)}
          onSuccess={() => {
            setCreateModalVisible(false);
            loadData();
          }}
          creatorId={admin.id}
        />
      )}

      {/* 编辑管理员弹窗 */}
      <EditAdministratorModal
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingAdmin(null);
        }}
        onSuccess={() => {
          setEditModalVisible(false);
          setEditingAdmin(null);
          loadData();
        }}
        administrator={editingAdmin}
      />
    </div>
  );
}
