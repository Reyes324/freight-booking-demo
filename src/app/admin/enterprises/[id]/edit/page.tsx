'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Form, Input, InputNumber, Select, Button, message, Modal } from 'antd';
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

export default function EditEnterprisePage() {
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const enterprise = enterprises.find((e) => e.id === params.id);

  const [countryCode, setCountryCode] = useState(enterprise?.countryCode || '+852');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState<string | null>(null);

  if (!enterprise) {
    return <div className="text-gray-500">企业不存在</div>;
  }

  const onCountryCodeChange = (value: string) => {
    setCountryCode(value);
    // 账期额度统一使用人民币，不随地区变化
    const phone = form.getFieldValue('phone');
    if (phone) {
      form.validateFields(['phone']);
    }
  };

  const onFinish = () => {
    messageApi.success('企业信息已更新');
    setTimeout(() => router.push('/admin/enterprises'), 800);
  };

  const handlePasswordChange = () => {
    passwordForm.validateFields().then((values) => {
      setNewPassword(values.newPassword);
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
      messageApi.success('密码已修改');
    });
  };

  return (
    <div>
      {contextHolder}
      {/* Back link */}
      <Link
        href="/admin/enterprises"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6"
      >
        <ArrowLeftOutlined />
        返回企业列表
      </Link>

      {/* Form card */}
      <div className="max-w-2xl bg-white rounded-xl border p-8">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">更改企业信息</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: enterprise.name,
            countryCode: enterprise.countryCode,
            phone: enterprise.phone,
            premiumRate: enterprise.premiumRate,
            creditLimit: enterprise.creditLimit,
          }}
        >
          {/* 企业ID只读展示 */}
          <Form.Item label="企业ID">
            <Input value={enterprise.id} disabled className="font-mono" />
          </Form.Item>

          <Form.Item
            label="企业名称"
            name="name"
            rules={getEnterpriseNameRules(enterprise.id)}
          >
            <Input placeholder="请输入企业名称" maxLength={50} />
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
                rules={getPhoneRules(countryCode, enterprise.id)}
              >
                <Input placeholder="请输入手机号" className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="登录密码">
            <div className="flex items-center gap-3">
              <Input
                value="••••••••"
                disabled
                className="flex-1"
              />
              <Button onClick={() => setIsPasswordModalOpen(true)}>
                修改密码
              </Button>
            </div>
          </Form.Item>

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

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={() => router.push('/admin/enterprises')}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
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
        <Form
          form={passwordForm}
          layout="vertical"
          className="mt-6"
        >
          <Form.Item
            label="新密码"
            name="newPassword"
            rules={passwordRules}
          >
            <Input.Password placeholder="8-20位，须包含字母和数字" />
          </Form.Item>

          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              {
                required: true,
                message: '请确认新密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
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
