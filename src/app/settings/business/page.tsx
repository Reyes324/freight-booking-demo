'use client';

import { Form, Input, Select, Button, message } from 'antd';
import { useT } from '@/hooks/useT';

export default function BusinessPage() {
  const t = useT();
  const [form] = Form.useForm();

  const businessTypeOptions = [
    { label: t.settings.business.ecommerce, value: 'ecommerce' },
    { label: t.settings.business.logistics, value: 'logistics' },
    { label: t.settings.business.food, value: 'food' },
    { label: t.settings.business.retail, value: 'retail' },
    { label: t.settings.business.manufacturing, value: 'manufacturing' },
    { label: t.settings.business.other, value: 'other' },
  ];

  const monthlyVolumeOptions = [
    { label: t.settings.business.vol050, value: '0-50' },
    { label: t.settings.business.vol51100, value: '51-100' },
    { label: t.settings.business.vol101500, value: '101-500' },
    { label: t.settings.business.vol500plus, value: '500+' },
  ];

  const handleSubmit = (values: any) => {
    console.log('提交企业账户申请:', values);
    message.success(t.settings.business.submit);
    form.resetFields();
  };

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-900 mb-2">
        {t.settings.business.title}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        {t.settings.business.subtitle}
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
            label={t.settings.business.name}
            rules={[{ required: true, message: t.settings.business.errorName }]}
          >
            <Input placeholder={t.settings.business.namePlaceholder} />
          </Form.Item>

          {/* 公司名称 */}
          <Form.Item
            name="companyName"
            label={
              <span>
                {t.settings.business.companyName}
                <span className="ml-2 text-xs text-gray-400 font-normal">
                  {t.settings.business.companyNameNote}
                </span>
              </span>
            }
            rules={[{ required: true, message: t.settings.business.errorCompany }]}
          >
            <Input placeholder={t.settings.business.companyNamePlaceholder} />
          </Form.Item>

          {/* 业务类型 */}
          <Form.Item
            name="businessType"
            label={t.settings.business.businessType}
            rules={[{ required: true, message: t.settings.business.errorType }]}
          >
            <Select
              placeholder={t.settings.business.businessTypePlaceholder}
              options={businessTypeOptions}
            />
          </Form.Item>

          {/* 每月预计使用量 */}
          <Form.Item
            name="monthlyVolume"
            label={t.settings.business.monthlyVolume}
            rules={[{ required: true, message: t.settings.business.errorVolume }]}
          >
            <Select
              placeholder={t.settings.business.monthlyVolumePlaceholder}
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
              {t.settings.business.submit}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
