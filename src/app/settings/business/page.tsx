'use client';

import { Form, Input, Select, Button, message } from 'antd';

const businessTypeOptions = [
  { label: '电商', value: 'ecommerce' },
  { label: '物流', value: 'logistics' },
  { label: '餐饮', value: 'food' },
  { label: '零售', value: 'retail' },
  { label: '制造业', value: 'manufacturing' },
  { label: '其他', value: 'other' },
];

const monthlyVolumeOptions = [
  { label: '0-50 单', value: '0-50' },
  { label: '51-100 单', value: '51-100' },
  { label: '101-500 单', value: '101-500' },
  { label: '500+ 单', value: '500+' },
];

export default function BusinessPage() {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log('提交企业账户申请:', values);
    message.success('企业账户申请已提交！');
    form.resetFields();
  };

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-2">
        升级企业账户
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        请填写您的企业信息
      </p>

      <div className="max-w-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* 姓名 */}
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入您的姓名" />
          </Form.Item>

          {/* 公司名称 */}
          <Form.Item
            name="companyName"
            label={
              <span>
                公司名称
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  （正式公司或企业名称，提交后无法修改）
                </span>
              </span>
            }
            rules={[{ required: true, message: '请输入公司名称' }]}
          >
            <Input placeholder="请输入公司全称" />
          </Form.Item>

          {/* 业务类型 */}
          <Form.Item
            name="businessType"
            label="业务类型"
            rules={[{ required: true, message: '请选择业务类型' }]}
          >
            <Select
              placeholder="请选择业务类型"
              options={businessTypeOptions}
            />
          </Form.Item>

          {/* 每月预计使用量 */}
          <Form.Item
            name="monthlyVolume"
            label="每月预计使用量"
            rules={[{ required: true, message: '请选择每月预计使用量' }]}
          >
            <Select
              placeholder="请选择每月预计使用量"
              options={monthlyVolumeOptions}
            />
          </Form.Item>

          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700"
            >
              免费添加企业账户
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
