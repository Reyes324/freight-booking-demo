'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Modal, App, Menu, ConfigProvider } from 'antd';
import Navbar from '@/components/Navbar';
import EnterpriseManagementPanel from '@/components/EnterpriseManagementPanel';
import { getCurrentAccount, type CurrentAccount } from '@/data/mockData';
import { enterprises } from '@/data/adminMockData';

const passwordRules = [
  { required: true, message: '请填写新密码' },
  { min: 8, max: 20, message: '密码为 8–20 位' },
  {
    pattern: /^(?=.*[a-zA-Z])(?=.*\d)[^一-龥\u{1F000}-\u{1FFFF}]*$/u,
    message: '须包含字母和数字，不可含汉字或表情符号',
  },
];

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center py-4 border-b border-gray-100 last:border-0">
      <span className="w-32 text-sm text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 text-sm text-gray-900">{children}</div>
    </div>
  );
}

function ProfileContent({ account }: { account: CurrentAccount }) {
  const { message } = App.useApp();
  const [pwdOpen, setPwdOpen] = useState(false);
  const [pwdForm] = Form.useForm();

  const enterprise = enterprises.find(e => e.id === account.accountId);
  const phone = enterprise ? `${enterprise.countryCode} ${enterprise.phone}` : '—';

  const handleChangePwd = () => {
    pwdForm.validateFields().then(() => {
      setPwdOpen(false);
      pwdForm.resetFields();
      message.success('密码已修改');
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">账户资料</h2>
      <Row label="企业名称">{account.companyName}</Row>
      <Row label="登录手机号">{phone}</Row>
      <Row label="密码">
        <button
          onClick={() => setPwdOpen(true)}
          className="text-sm text-[#2257D4] hover:text-[#1C47AC] transition-colors cursor-pointer"
        >
          修改密码
        </button>
      </Row>

      <Modal
        title="修改登录密码"
        open={pwdOpen}
        onOk={handleChangePwd}
        onCancel={() => { setPwdOpen(false); pwdForm.resetFields(); }}
        okText="确定"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={pwdForm} layout="vertical" className="mt-4">
          <Form.Item label="新密码" name="newPassword" rules={passwordRules}>
            <Input.Password placeholder="8–20 位，须包含字母和数字" />
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

export default function SettingsPage() {
  const [account, setAccount] = useState<CurrentAccount | null>(null);
  const [activeKey, setActiveKey] = useState('profile');

  useEffect(() => {
    setAccount(getCurrentAccount());
  }, []);

  const isParent = account?.accountType === 'parent';

  const menuItems: MenuItem[] = [
    { key: 'profile', label: '账户资料' },
    ...(isParent ? [{ key: 'account', label: '子账户设置' }] : []),
  ];

  return (
    <App>
      <div className="h-screen flex flex-col bg-gray-100">
        <Navbar />

        <div className="flex-1 flex overflow-hidden">
          {/* 左侧导航 */}
          <aside className="w-56 shrink-0 border-r border-gray-200 bg-gray-100 overflow-y-auto pt-4">
            <ConfigProvider
              theme={{
                components: {
                  Menu: {
                    itemBg: 'transparent',
                    itemSelectedBg: 'rgba(34, 87, 212, 0.08)',
                    itemHoverBg: 'rgba(0, 0, 0, 0.05)',
                    itemSelectedColor: '#2257D4',
                    itemColor: '#0F1229',
                    itemHeight: 50,
                    itemPaddingInline: 20,
                    itemMarginInline: 0,
                    itemBorderRadius: 0,
                    fontSize: 15,
                  },
                },
              }}
            >
              <Menu
                mode="inline"
                selectedKeys={[activeKey]}
                onClick={({ key }) => setActiveKey(key)}
                style={{ background: 'transparent', border: 'none' }}
                items={menuItems.map(item => ({
                key: item.key,
                label: <span style={activeKey === item.key ? { fontWeight: 600 } : {}}>{item.label}</span>,
              }))}
              />
            </ConfigProvider>
          </aside>

          {/* 右侧内容 */}
          <main className="flex-1 bg-white overflow-y-auto">
            <div className="max-w-2xl px-10 py-8">
              {account && activeKey === 'profile' && <ProfileContent account={account} />}
              {isParent && activeKey === 'account' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-10">子账户设置</h2>
                  <EnterpriseManagementPanel />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </App>
  );
}
