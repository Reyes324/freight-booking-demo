'use client';

import { useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Empty, App, Alert, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { type Enterprise, type AdminSubAccount } from '@/data/adminMockData';
import { countryCodes } from '@/data/enterpriseConstants';
import { passwordRules } from '@/lib/enterpriseUtils';

const fmt = (n: number) => `CNY ${n.toLocaleString('zh-CN')}`;

export default function AdminSubAccountsTab({
  enterprise,
  onChange,
}: {
  enterprise: Enterprise;
  onChange: (updated: Enterprise) => void;
}) {
  const { message } = App.useApp();
  const subAccounts = enterprise.subAccounts ?? [];

  // 演示：企业停用状态（不修改企业真实 status，仅本 Tab 内预览停用后的联动效果）
  const [demoDisabled, setDemoDisabled] = useState(false);
  const isEnterpriseDisabled = enterprise.status === 'disabled' || demoDisabled;

  // 演示：空状态
  const [demoEmpty, setDemoEmpty] = useState(false);
  const displayAccounts = demoEmpty ? [] : subAccounts;

  const total = enterprise.creditLimit;
  const allocated = useMemo(
    () => (demoEmpty ? 0 : subAccounts.reduce((sum, s) => sum + s.quota, 0)),
    [subAccounts, demoEmpty]
  );
  const remaining = total - allocated;

  // 演示：超额分配（用一个低于已分配额度的假总额度，展示超额警示）
  const [demoOverAlloc, setDemoOverAlloc] = useState(false);
  const displayTotal = demoOverAlloc ? Math.max(0, allocated - 1000) : total;
  const displayRemaining = displayTotal - allocated;

  const updateSubAccounts = (updater: (prev: AdminSubAccount[]) => AdminSubAccount[]) => {
    onChange({ ...enterprise, subAccounts: updater(subAccounts) });
  };

  // 开通母账号资格
  const handleEnableParent = () => {
    Modal.confirm({
      title: '开通子账号功能？',
      content: `开通后，运营可为「${enterprise.name}」新增子账号，子账号额度将从该企业的每月账期额度（${fmt(enterprise.creditLimit)}）中划分。`,
      okText: '确认开通',
      cancelText: '取消',
      onOk: () => {
        onChange({ ...enterprise, isParent: true, subAccounts: [] });
        message.success('已开通子账号功能');
      },
    });
  };

  // 新增
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [createCountryCode, setCreateCountryCode] = useState('+60');

  // 编辑
  const [editTarget, setEditTarget] = useState<AdminSubAccount | null>(null);
  const [editForm] = Form.useForm();
  const [editCountryCode, setEditCountryCode] = useState('+60');

  // 修改密码（编辑弹窗内）
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwForm] = Form.useForm();

  const openEdit = (record: AdminSubAccount) => {
    const match = record.phone.match(/^(\+\d+)\s+(.*)$/);
    const code = match ? match[1] : '+60';
    const number = match ? match[2] : record.phone;
    setEditCountryCode(code);
    setEditTarget(record);
    editForm.setFieldsValue({ name: record.name, phoneNumber: number, quota: record.quota });
  };

  const handleCreate = async () => {
    const values = await createForm.validateFields();
    const newAccount: AdminSubAccount = {
      id: `SUB-${Date.now()}`,
      name: values.name.trim(),
      phone: `${createCountryCode} ${values.phoneNumber.trim()}`,
      quota: values.quota,
      balance: values.quota,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    updateSubAccounts((prev) => [...prev, newAccount]);
    setCreateOpen(false);
    createForm.resetFields();
    message.success('子账号创建成功');
  };

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    if (!editTarget) return;
    updateSubAccounts((prev) =>
      prev.map((s) =>
        s.id === editTarget.id
          ? {
              ...s,
              name: values.name.trim(),
              phone: `${editCountryCode} ${values.phoneNumber.trim()}`,
              quota: values.quota,
              balance: s.balance + (values.quota - s.quota),
            }
          : s
      )
    );
    setEditTarget(null);
    message.success('子账号信息已更新');
  };

  const handlePasswordChange = async () => {
    await pwForm.validateFields();
    setPwModalOpen(false);
    pwForm.resetFields();
    message.success('密码已修改');
  };

  const handleStatusChange = (record: AdminSubAccount, checked: boolean) => {
    if (checked) {
      updateSubAccounts((prev) =>
        prev.map((s) => (s.id === record.id ? { ...s, status: 'active' } : s))
      );
      message.success('子账号已启用');
    } else {
      Modal.confirm({
        title: '确认停用该子账号？',
        content: '停用后该账号将无法登录，历史订单仍可查看。',
        okText: '停用',
        okButtonProps: { danger: true },
        cancelText: '取消',
        onOk: () => {
          updateSubAccounts((prev) =>
            prev.map((s) => (s.id === record.id ? { ...s, status: 'disabled' } : s))
          );
          message.success('子账号已停用');
        },
      });
    }
  };

  const columns: ColumnsType<AdminSubAccount> = [
    {
      title: '账号名称',
      dataIndex: 'name',
      key: 'name',
      width: 140,
      render: (name: string) => <span>{name}</span>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (phone: string) => <span className="text-sm text-gray-600">{phone}</span>,
    },
    {
      title: '已分配额度',
      dataIndex: 'quota',
      key: 'quota',
      width: 120,
      render: (quota: number) => <span className="text-sm text-gray-900">{fmt(quota)}</span>,
    },
    {
      title: '本月当前余额',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      render: (balance: number) => <span className="text-sm text-gray-900">{fmt(balance)}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 72,
      render: (status: AdminSubAccount['status'], record) => (
        <Switch
          checked={status === 'active'}
          onChange={(checked) => handleStatusChange(record, checked)}
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (_, record) => (
        <Button type="link" size="small" className="keep-color" onClick={() => openEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  if (!enterprise.isParent) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 py-16">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={`「${enterprise.name}」尚未开通子账号功能`}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleEnableParent}
          >
            开通子账号功能
          </Button>
        </Empty>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setDemoDisabled((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-dashed border-gray-300 rounded px-2.5 py-1 transition-colors cursor-pointer"
          >
            {demoDisabled ? '还原企业启用状态' : '演示企业停用状态'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isEnterpriseDisabled && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          message="企业账号已停用，其下所有子账号均无法登录下单"
        />
      )}

      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-medium text-gray-900">子账号列表</span>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          disabled={remaining <= 0}
        >
          新增子账号
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <Table
          columns={columns}
          dataSource={displayAccounts}
          rowKey="id"
          pagination={false}
          size="small"
          rowClassName={(record) => record.status === 'disabled' ? 'row-disabled' : ''}
          scroll={{ x: 602 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无子账号，点击「新增子账号」开始添加"
              />
            ),
          }}
        />
      </div>

      <p className="text-base font-medium text-gray-900 mt-8 mb-3">额度分配情况</p>
      <div className="flex gap-3 mb-3">
        {[
          { label: '企业账期总额度', value: displayTotal },
          { label: '已分配子账号', value: allocated },
          { label: '未分配（企业主账号可用）', value: displayRemaining },
        ].map(({ label, value }) => (
          <div key={label} className="flex-1 bg-white border border-gray-200 rounded-xl px-5 py-4">
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            <p className={`text-lg font-semibold ${value === displayRemaining && value < 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {fmt(value)}
            </p>
          </div>
        ))}
      </div>

      {displayRemaining < 0 && (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          message={<>企业账期额度调低后,子账号额度总和<span className="text-red-500">已超出限额</span>,请尽快修改子账号额度。</>}
        />
      )}

      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setDemoEmpty((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-dashed border-gray-300 rounded px-2.5 py-1 transition-colors cursor-pointer"
        >
          {demoEmpty ? '还原示例数据' : '演示空状态'}
        </button>
        <button
          onClick={() => setDemoOverAlloc((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-dashed border-gray-300 rounded px-2.5 py-1 transition-colors cursor-pointer"
        >
          {demoOverAlloc ? '还原正常额度' : '演示超额分配'}
        </button>
        <button
          onClick={() => setDemoDisabled((v) => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-dashed border-gray-300 rounded px-2.5 py-1 transition-colors cursor-pointer"
        >
          {demoDisabled ? '还原企业启用状态' : '演示企业停用状态'}
        </button>
      </div>

      {/* 新增子账号弹窗 */}
      <Modal
        title="新增子账号"
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => { setCreateOpen(false); createForm.resetFields(); setCreateCountryCode('+60'); }}
        okText="确认创建"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" className="mt-4">
          <Form.Item
            label="账号名称"
            name="name"
            rules={[
              { required: true, message: '请填写账号名称' },
              { max: 20, message: '账号名称最多 20 字符' },
            ]}
          >
            <Input placeholder="如：马来西亚子账号" />
          </Form.Item>
          <Form.Item label="手机号" required>
            <div className="flex gap-2">
              <Select
                value={createCountryCode}
                onChange={setCreateCountryCode}
                options={countryCodes}
                style={{ width: 160 }}
              />
              <Form.Item
                name="phoneNumber"
                noStyle
                rules={[{ required: true, message: '请填写手机号' }]}
              >
                <Input placeholder="请输入手机号" className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="密码" name="password" rules={passwordRules}>
            <Input.Password placeholder="8–20 位，含字母和数字" />
          </Form.Item>
          <Form.Item
            label="分配额度（CNY）"
            name="quota"
            rules={[
              { required: true, message: '请填写分配额度' },
              {
                validator: (_, value) =>
                  value > remaining
                    ? Promise.reject(new Error(`超出可分配额度，当前剩余 ${fmt(remaining)}`))
                    : Promise.resolve(),
              },
            ]}
            extra={`当前剩余可分配：${fmt(remaining)}`}
          >
            <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入" precision={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑子账号弹窗 */}
      <Modal
        title="编辑子账号"
        open={!!editTarget}
        onOk={handleEdit}
        onCancel={() => { setEditTarget(null); editForm.resetFields(); }}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" className="mt-4">
          <Form.Item
            label="账号名称"
            name="name"
            rules={[
              { required: true, message: '请填写账号名称' },
              { max: 20, message: '账号名称最多 20 字符' },
            ]}
          >
            <Input placeholder="如：马来西亚子账号" />
          </Form.Item>
          <Form.Item label="手机号" required>
            <div className="flex gap-2">
              <Select
                value={editCountryCode}
                onChange={setEditCountryCode}
                options={countryCodes}
                style={{ width: 160 }}
              />
              <Form.Item
                name="phoneNumber"
                noStyle
                rules={[{ required: true, message: '请填写手机号' }]}
              >
                <Input placeholder="请输入手机号" className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item label="登录密码">
            <div className="flex items-center gap-3">
              <Input value="••••••••" disabled className="flex-1" />
              <Button onClick={() => setPwModalOpen(true)}>修改密码</Button>
            </div>
          </Form.Item>
          <Form.Item
            label="分配额度（CNY）"
            name="quota"
            rules={[
              { required: true, message: '请填写额度' },
              {
                validator: (_, value) => {
                  const others = subAccounts
                    .filter((s) => s.id !== editTarget?.id)
                    .reduce((sum, s) => sum + s.quota, 0);
                  return value + others > total
                    ? Promise.reject(new Error(`调整后超出总额度上限，当前可分配 ${fmt(total - others)}`))
                    : Promise.resolve();
                },
              },
            ]}
            extra={editTarget ? `当前剩余可分配：${fmt(total - subAccounts.filter((s) => s.id !== editTarget.id).reduce((sum, s) => sum + s.quota, 0))}` : undefined}
          >
            <InputNumber min={1} style={{ width: '100%' }} precision={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改登录密码"
        open={pwModalOpen}
        onOk={handlePasswordChange}
        onCancel={() => { setPwModalOpen(false); pwForm.resetFields(); }}
        okText="确定"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={pwForm} layout="vertical" className="mt-6">
          <Form.Item label="新密码" name="newPassword" rules={passwordRules}>
            <Input.Password placeholder="8–20 位，含字母和数字" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
