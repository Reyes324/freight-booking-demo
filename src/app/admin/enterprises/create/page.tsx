'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, InputNumber, Select, Button, message, Modal } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { countryCodes } from '@/data/enterpriseConstants';
import { PREMIUM_RATE_MAX, CREDIT_LIMIT_MAX } from '@/data/enterpriseConstants';
import {
  generateEnterpriseId,
  getEnterpriseNameRules,
  getPhoneRules,
  passwordRules,
  premiumRateRules,
  creditLimitRules,
} from '@/lib/enterpriseUtils';

export default function CreateEnterprisePage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [countryCode, setCountryCode] = useState('+60');

  const onCountryCodeChange = (value: string) => {
    setCountryCode(value);
    // 账期额度统一使用人民币，不随地区变化
    // 重新校验手机号
    const phone = form.getFieldValue('phone');
    if (phone) {
      form.validateFields(['phone']);
    }
  };

  const onFinish = () => {
    const newId = generateEnterpriseId();
    Modal.success({
      title: '企业账号创建成功',
      content: (
        <div className="mt-2">
          <p className="text-gray-600">企业ID：</p>
          <p className="font-mono text-lg font-semibold mt-1">{newId}</p>
        </div>
      ),
      okText: '返回列表',
      onOk: () => router.push('/admin/enterprises'),
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
        <h1 className="text-xl font-semibold text-gray-900 mb-6">创建企业账号</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ countryCode: '+60', premiumRate: 1.15 }}
        >
          <Form.Item
            label="企业名称"
            name="name"
            rules={getEnterpriseNameRules()}
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
                rules={getPhoneRules(countryCode)}
              >
                <Input placeholder="请输入手机号" className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            label="登录密码"
            name="password"
            rules={passwordRules}
          >
            <Input.Password placeholder="8-20位，须包含字母和数字" />
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
              创建账号
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
