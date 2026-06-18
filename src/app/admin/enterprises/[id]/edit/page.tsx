'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Input, InputNumber, Select, Button, message, Modal, Radio, Alert } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { enterprises } from '@/data/adminMockData';
import { countryCodes } from '@/data/enterpriseConstants';
import { PREMIUM_RATE_MAX, CREDIT_LIMIT_MAX } from '@/data/enterpriseConstants';
import {
  getEnterpriseNameRules,
  getPhoneRules,
  passwordRules,
  premiumRateRules,
  creditLimitRules,
} from '@/lib/enterpriseUtils';

type AccountType = 'normal' | 'sub';

export default function EditEnterprisePage() {
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // 先查 enterprise，再查 sub-account
  const enterprise = enterprises.find((e) => e.id === params.id);
  const subAccountParent = !enterprise
    ? enterprises.find((e) => e.subAccounts?.some((s) => s.id === params.id))
    : null;
  const subAccount = subAccountParent?.subAccounts?.find((s) => s.id === params.id);

  const isSubMode = !!subAccount;

  const initAccountType = (): AccountType => {
    if (isSubMode) return 'sub';
    return 'normal';
  };

  const [accountType, setAccountType] = useState<AccountType>(initAccountType);
  const [countryCode, setCountryCode] = useState(
    enterprise?.countryCode || subAccountParent?.countryCode || '+852'
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(subAccountParent?.id ?? null);

  const selectedParentEnterprise = enterprises.find((e) => e.id === selectedParentId);

  if (!enterprise && !subAccount) {
    return <div className="text-gray-500">企业不存在</div>;
  }

  const currentId = (enterprise?.id ?? subAccount!.id) as string;
  const currentName = enterprise?.name ?? subAccount!.name;

  const parentEnterpriseOptions = enterprises
    .map((e) => ({ label: e.name, value: e.id }));

  const onCountryCodeChange = (value: string) => {
    setCountryCode(value);
    const phone = form.getFieldValue('phone');
    if (phone) form.validateFields(['phone']);
  };

  const onFinish = () => {
    messageApi.success('信息已更新');
    setTimeout(() => router.push('/admin/enterprises'), 800);
  };

  const handlePasswordChange = () => {
    passwordForm.validateFields().then(() => {
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
      messageApi.success('密码已修改');
    });
  };

  return (
    <div>
      {contextHolder}
      <Link
        href="/admin/enterprises"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6"
      >
        <ArrowLeftOutlined />
        返回企业列表
      </Link>

      <div className="max-w-2xl bg-white rounded-xl border p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">更改企业信息</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: currentName,
            countryCode: enterprise?.countryCode ?? subAccountParent?.countryCode ?? '+852',
            phone: enterprise?.phone ?? subAccount?.phone,
            premiumRate: enterprise?.premiumRate,
            creditLimit: enterprise?.creditLimit,
            quota: subAccount?.quota,
            parentEnterpriseId: subAccountParent?.id,
          }}
        >
          {/* 账号类型 */}
          <Form.Item label="账号类型">
            <Radio.Group
              value={accountType}
              onChange={(e) => setAccountType(e.target.value as AccountType)}
            >
              <Radio value="normal">企业账号</Radio>
              <Radio value="sub">子账号</Radio>
            </Radio.Group>
          </Form.Item>

          {accountType === 'sub' && (
            <Form.Item
              label="归属上级企业账号"
              name="parentEnterpriseId"
              rules={[{ required: true, message: '请选择上级企业账号' }]}
            >
              <Select
                options={parentEnterpriseOptions}
                placeholder="请选择上级企业账号"
                style={{ width: '100%' }}
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={(v) => {
                  setSelectedParentId(v);
                  form.validateFields(['name']);
                }}
              />
            </Form.Item>
          )}

          <Form.Item
            label={accountType === 'normal' ? '企业名称' : '账号名称'}
            name="name"
            rules={[
              ...getEnterpriseNameRules(currentId),
              {
                validator: (_, value: string) => {
                  if (accountType === 'sub' && selectedParentEnterprise && value?.trim() === selectedParentEnterprise.name) {
                    return Promise.reject('子账号名称不能与上级企业名称相同');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder={accountType === 'normal' ? '请输入企业名称' : '请输入账号名称'} maxLength={50} />
          </Form.Item>

          <Form.Item label="登录手机号" required>
            <div className="flex gap-2">
              <Form.Item name="countryCode" noStyle>
                <Select
                  options={countryCodes}
                  style={{ width: 160 }}
                  onChange={onCountryCodeChange}
                />
              </Form.Item>
              <Form.Item
                name="phone"
                noStyle
                rules={getPhoneRules(countryCode, currentId)}
              >
                <Input placeholder="请输入手机号" className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="登录密码">
            <div className="flex items-center gap-3">
              <Input value="••••••••" disabled className="flex-1" />
              <Button onClick={() => setIsPasswordModalOpen(true)}>修改密码</Button>
            </div>
          </Form.Item>

          {/* 子账号：分配额度 */}
          {accountType === 'sub' && (
            <Form.Item
              label="分配额度（人民币）"
              name="quota"
              rules={[{ required: true, message: '请输入分配额度' }]}
            >
              <InputNumber
                min={0}
                step={1000}
                precision={0}
                placeholder="5000"
                addonBefore="CNY"
                style={{ width: '100%' }}
              />
            </Form.Item>
          )}

          {accountType === 'sub' && (
            <Form.Item label="订单溢价系数">
              <Input
                disabled
                value={`${subAccountParent?.premiumRate?.toFixed(2) ?? '—'}（跟随上级账号）`}
              />
            </Form.Item>
          )}

          {accountType !== 'sub' && (
            <>
              <Form.Item
                label="订单溢价系数"
                name="premiumRate"
                extra="订单实际收费 = 基础运费 × 溢价系数"
                rules={premiumRateRules}
              >
                <InputNumber min={1} max={PREMIUM_RATE_MAX} step={0.01} precision={2} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                label="每月账期额度（人民币）"
                name="creditLimit"
                rules={creditLimitRules}
              >
                <InputNumber
                  min={0}
                  max={CREDIT_LIMIT_MAX}
                  step={1000}
                  precision={0}
                  placeholder="50000"
                  addonBefore="CNY"
                  style={{ width: '100%' }}
                />
              </Form.Item>

              {enterprise?.isParent && enterprise && (
                <Form.Item noStyle shouldUpdate={(p, c) => p.creditLimit !== c.creditLimit}>
                  {({ getFieldValue }) => {
                    const allocated = (enterprise.subAccounts ?? []).reduce((sum, s) => sum + s.quota, 0);
                    const creditLimit = getFieldValue('creditLimit') ?? 0;
                    if (creditLimit < allocated) {
                      return (
                        <Alert
                          type="warning"
                          showIcon
                          className="mb-6"
                          message={`当前账期额度（CNY ${creditLimit.toLocaleString('zh-CN')}）低于子账号已分配额度合计（CNY ${allocated.toLocaleString('zh-CN')}），请注意`}
                        />
                      );
                    }
                    return null;
                  }}
                </Form.Item>
              )}
            </>
          )}

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={() => router.push('/admin/enterprises')}>取消</Button>
            <Button type="primary" htmlType="submit">保存</Button>
          </div>
        </Form>
      </div>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改登录密码"
        open={isPasswordModalOpen}
        onOk={handlePasswordChange}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        okText="确定"
        cancelText="取消"
      >
        <Form form={passwordForm} layout="vertical" className="mt-6">
          <Form.Item label="新密码" name="newPassword" rules={passwordRules}>
            <Input.Password placeholder="8-20位，须包含字母和数字" />
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
    </div>
  );
}
