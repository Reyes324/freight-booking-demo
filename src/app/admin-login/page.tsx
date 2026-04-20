'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

export default function LoginPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const doLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        document.cookie = 'auth=true; path=/';
        localStorage.setItem('currentAdmin', JSON.stringify({
          id: 'ADM001',
          username: 'admin',
          name: '系统管理员',
          role: 'super_admin',
          status: 'active'
        }));
      }
      router.push('/admin/orders');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 px-8 py-10" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-white"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">企业国际运营后台</span>
            </div>
          </div>

          {/* Form */}
          <Form
            form={form}
            onFinish={doLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item name="username" className="mb-4">
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-300" />}
                placeholder="账号"
              />
            </Form.Item>

            <Form.Item name="password" className="mb-6">
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-gray-300" />}
                placeholder="密码"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-10 font-medium"
            >
              登录
            </Button>
          </Form>

          {/* Demo hint */}
          <div className="text-center mt-6 text-xs text-gray-400">
            演示模式 · 点击登录即可进入
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 货拉拉企业国际版
        </p>
      </div>
    </div>
  );
}
