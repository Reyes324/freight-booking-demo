'use client';

import { useMemo, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Empty, App, Alert, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  mockSubAccounts,
  mockParentQuota,
  type SubAccount,
} from '@/data/mockData';
import { countryCodes } from '@/data/enterpriseConstants';

const fmt = (n: number) => `CNY ${n.toLocaleString('zh-CN')}`;

const passwordRules = [
  { required: true, message: '请填写密码' },
  { min: 8, max: 20, message: '密码为 8–20 位' },
  {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[^一-龥\u{1F000}-\u{1FFFF}]*$/u,
    message: '须包含字母和数字，不可含汉字或表情符号',
  },
];

export default function EnterpriseManagementPanel() {
  const { message } = App.useApp();

  const [subAccounts, setSubAccounts] = useState<SubAccount[]>(mockSubAccounts);
  const [demoEmpty, setDemoEmpty] = useState(false);
  const displayAccounts = demoEmpty ? [] : subAccounts;

  const total = mockParentQuota.total;
  const allocated = useMemo(
    () => (demoEmpty ? 0 : subAccounts.reduce((sum, s) => sum + s.quota, 0)),
    [subAccounts, demoEmpty]
  );
  const remaining = total - allocated;

  const [demoOverAlloc, setDemoOverAlloc] = useState(false);
  const displayTotal = demoOverAlloc ? 5000 : total;
  const displayRemaining = displayTotal - allocated;

  // 新增
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [createCountryCode, setCreateCountryCode] = useState('+60');

  // 编辑
  const [editTarget, setEditTarget] = useState<SubAccount | null>(null);
  const [editForm] = Form.useForm();
  const [editCountryCode, setEditCountryCode] = useState('+60');

  // 修改密码（编辑弹窗内）
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [pwForm] = Form.useForm();

  const openEdit = (record: SubAccount) => {
    // 尝试从 phone 字段拆出区号，如 "+84 901234567" → code="+84", number="901234567"
    const match = record.phone.match(/^(\+\d+)\s+(.*)$/);
    const code = match ? match[1] : '+60';
    const number = match ? match[2] : record.phone;
    setEditCountryCode(code);
    setEditTarget(record);
    editForm.setFieldsValue({ name: record.name, phoneNumber: number, quota: record.quota });
  };

  const handleCreate = async () => {
    const values = await createForm.validateFields();
    const newAccount: SubAccount = {
      id: `SUB-${Date.now()}`,
      name: values.name.trim(),
      phone: `${createCountryCode} ${values.phoneNumber.trim()}`,
      quota: values.quota,
      balance: values.quota,
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setSubAccounts((prev) => [...prev, newAccount]);
    setCreateOpen(false);
    createForm.resetFields();
    message.success('子账号创建成功');
  };

  const handleEdit = async () => {
    const values = await editForm.validateFields();
    if (!editTarget) return;
    setSubAccounts((prev) =>
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

  const handleStatusChange = (record: SubAccount, checked: boolean) => {
    if (checked) {
      setSubAccounts((prev) =>
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
          setSubAccounts((prev) =>
            prev.map((s) => (s.id === record.id ? { ...s, status: 'disabled' } : s))
          );
          message.success('子账号已停用');
        },
      });
    }
  };

  const columns: ColumnsType<SubAccount> = [
    {
      title: '账号名称',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <span className={record.status === 'disabled' ? 'text-gray-400' : 'text-gray-900 font-medium'}>
          {name}
        </span>
      ),
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string) => <span className="text-sm text-gray-600">{phone}</span>,
    },
    {
      title: '已分配额度',
      dataIndex: 'quota',
      key: 'quota',
      align: 'right',
      render: (quota: number) => <span className="text-sm text-gray-900">{fmt(quota)}</span>,
    },
    {
      title: '当前余额',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right',
      render: (balance: number) => (
        <span className="text-sm text-gray-900">{fmt(balance)}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 72,
      render: (status: SubAccount['status'], record) => (
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
        <button
          onClick={() => openEdit(record)}
          className="text-sm text-[#2257D4] hover:text-[#1C47AC] transition-colors cursor-pointer"
        >
          编辑
        </button>
      ),
    },
  ];

  return (
    <>
      {/* 额度概览 */}
      <p className="text-base font-medium text-gray-900 mb-2">额度分配概览</p>
      {/* 说明 */}
      <p className="text-sm text-gray-500 mb-3">
        您可为企业创建子账号并分配额度，各子账号独立管理订单和交易明细，母账号可查看全部数据。
      </p>
      <div className="grid grid-cols-3 divide-x divide-gray-100 border border-gray-100 rounded-xl mb-3 bg-gray-50">
        {[
          { label: '企业总额度', value: displayTotal },
          { label: '已分配额度', value: allocated },
          { label: '未分配额度（母账号可用）', value: displayRemaining },
        ].map(({ label, value }) => (
          <div key={label} className="px-5 py-4">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-base font-semibold ${value < 0 ? 'text-red-500' : 'text-gray-900'}`}>
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
          message="因企业总额度调低，子账号额度总额已超出限额。请尽快修改子账号额度，企业整体额度用尽后所有账号均无法继续下单。"
        />
      )}

      {/* Demo 按钮 — 右下角浮层 */}
      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => setDemoEmpty(v => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-dashed border-gray-300 rounded px-3 py-1.5 shadow-sm transition-colors cursor-pointer"
        >
          {demoEmpty ? '还原示例数据' : '演示空状态'}
        </button>
        <button
          onClick={() => setDemoOverAlloc(v => !v)}
          className="text-xs text-gray-400 hover:text-gray-600 bg-white border border-dashed border-gray-300 rounded px-3 py-1.5 shadow-sm transition-colors cursor-pointer"
        >
          {demoOverAlloc ? '还原正常额度' : '演示超额分配'}
        </button>
      </div>

      {/* 子账号列表标题 + 操作区 */}
      <div className="flex items-center justify-between mb-3 mt-8">
        <div className="flex items-center gap-3">
          <span className="text-base font-medium text-gray-900">子账号列表</span>
        </div>
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
            label="初始分配额度（CNY）"
            name="quota"
            rules={[
              { required: true, message: '请填写初始分配额度' },
              {
                validator: (_, value) =>
                  value > remaining
                    ? Promise.reject(new Error(`超出可分配额度，当前剩余 ${fmt(remaining)}`))
                    : Promise.resolve(),
              },
            ]}
            extra={`当前剩余可分配：${fmt(remaining)}`}
          >
            <InputNumber min={1} className="w-full" placeholder="请输入正整数" precision={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑子账号弹窗 */}
      <Modal
        title={`编辑子账号 · ${editTarget?.name ?? ''}`}
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
                  return value + others > displayTotal
                    ? Promise.reject(new Error(`调整后超出总额度上限，当前可分配 ${fmt(displayTotal - others)}`))
                    : Promise.resolve();
                },
              },
            ]}
            extra={editTarget ? `调整将同步更新该子账号余额（当前余额 ${fmt(editTarget.balance)}）` : undefined}
          >
            <InputNumber min={1} className="w-full" precision={0} />
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
