'use client';

import { useRouter, useParams } from 'next/navigation';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { enterprises } from '@/data/adminMockData';

const countryCodes = [
  { value: '+852', label: '+852 香港' },
  { value: '+66', label: '+66 泰国' },
  { value: '+86', label: '+86 中国' },
  { value: '+65', label: '+65 新加坡' },
  { value: '+60', label: '+60 马来西亚' },
];

const currencyOptions = [
  { value: 'HK$', label: 'HK$ 港币' },
  { value: 'THB', label: 'THB 泰铢' },
  { value: 'CNY', label: 'CNY 人民币' },
  { value: 'SGD', label: 'SGD 新加坡元' },
  { value: 'MYR', label: 'MYR 马来西亚林吉特' },
];

export default function EditEnterprisePage() {
  const router = useRouter();
  const params = useParams();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const enterprise = enterprises.find((e) => e.id === params.id);

  if (!enterprise) {
    return <div className="text-gray-500">企业不存在</div>;
  }

  const onFinish = () => {
    messageApi.success('企业信息已更新');
    setTimeout(() => router.push('/admin/enterprises'), 800);
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
            password: enterprise.password,
            premiumRate: enterprise.premiumRate,
            currency: enterprise.currency,
            creditLimit: enterprise.creditLimit,
          }}
        >
          <Form.Item
            label="企业名称"
            name="name"
            rules={[{ required: true, message: '请输入企业名称' }]}
          >
            <Input placeholder="请输入企业名称" />
          </Form.Item>

          <Form.Item label="登录手机号" required>
            <div className="flex gap-2">
              <Form.Item name="countryCode" noStyle>
                <Select options={countryCodes} style={{ width: 160 }} />
              </Form.Item>
              <Form.Item
                name="phone"
                noStyle
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder="请输入手机号" className="flex-1" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            label="登录密码"
            name="password"
            rules={[{ required: true, message: '请输入登录密码' }]}
          >
            <Input placeholder="请输入登录密码" />
          </Form.Item>

          <Form.Item
            label="订单溢价系数"
            name="premiumRate"
            extra="订单实际收费 = 基础运费 × 溢价系数"
            rules={[{ required: true, message: '请输入溢价系数' }]}
          >
            <InputNumber min={1} step={0.01} precision={2} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="每月账期额度" required>
            <div className="flex gap-2">
              <Form.Item name="currency" noStyle>
                <Select options={currencyOptions} style={{ width: 160 }} />
              </Form.Item>
              <Form.Item
                name="creditLimit"
                noStyle
                rules={[{ required: true, message: '请输入额度' }]}
              >
                <InputNumber
                  min={0}
                  step={1000}
                  placeholder="50000"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </div>
          </Form.Item>

          <div className="flex justify-end gap-3 mt-8">
            <Button onClick={() => router.push('/admin/enterprises')}>取消</Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
